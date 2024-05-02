import { attributes } from '../../core/ids-attributes';
import { breakpoints, Breakpoints } from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';
import { customElement, scss } from '../../core/ids-decorators';

import IdsBreakpointMixin from '../../mixins/ids-breakpoint-mixin/ids-breakpoint-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsFocusCaptureMixin from '../../mixins/ids-focus-capture-mixin/ids-focus-capture-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsPopupInteractionsMixin from '../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin';
import IdsXssMixin from '../../mixins/ids-xss-mixin/ids-xss-mixin';
import IdsElement from '../../core/ids-element';

import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { waitForTransitionEnd, getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import { cssTransitionTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';

import '../ids-popup/ids-popup';
import './ids-modal-button';
import IdsOverlay from './ids-overlay';
import type IdsModalButton from './ids-modal-button';

// Import Styles
import styles from './ids-modal.scss';

type IdsModalFullsizeAttributeValue = null | 'null' | '' | keyof Breakpoints | 'always';

const Base = IdsXssMixin(
  IdsBreakpointMixin(
    IdsFocusCaptureMixin(
      IdsKeyboardMixin(
        IdsPopupInteractionsMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

/**
 * IDS Modal Component
 * @type {IdsModal}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsFocusCaptureMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsPopupInteractionsMixin
 * @mixes IdsXssMixin
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
@customElement('ids-modal')
@scss(styles)
export default class IdsModal extends Base {
  static zCount = 1020;

  shouldUpdate = false;

  onButtonClick?: (target: any) => void;

  ro?: ResizeObserver;

  /**
   * @property {Array<string>} Modal vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow', 'beforehide'];

  /**
   * @property {boolean} visible true if this Modal instance is visible.
   */
  #visible = false;

  globalKeydownListener = async (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.stopImmediatePropagation();
        await this.hide();
        break;
      default:
        break;
    }
  };

  constructor() {
    super();

    this.state ??= {};
    this.state.fullsize = '';
    this.state.overlay = null;
    this.state.scrollable = true;
    this.state.messageTitle = null;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.CLICK_OUTSIDE_TO_CLOSE,
      attributes.FULLSIZE,
      attributes.MESSAGE_TITLE,
      attributes.SCROLLABLE,
      attributes.SHOW_CLOSE_BUTTON,
      attributes.VISIBLE
    ];
  }

  connectedCallback(): void {
    super.connectedCallback?.();

    if (this.popup) {
      this.popup.setAttribute(attributes.TYPE, 'modal');
      this.popup.setAttribute(attributes.ANIMATED, 'false');
      this.popup.setAttribute(attributes.ANIMATION_STYLE, 'none');
      this.popup.onOutsideClick = () => {};
    }

    // Update ARIA / Sets up the label
    this.messageTitle = this.querySelector('[slot="title"]')?.textContent ?? '';
    this.setAttribute('role', 'dialog');
    this.refreshAriaLabel();

    // Update Outer Modal Parts
    this.#refreshOverlay();

    this.attachEventHandlers();
    this.shouldUpdate = true;
    this.setResize();
    this.#setFullsizeDefault();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#setFocusIfVisible();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.#clearBreakpointResponse();
    this.ro?.disconnect();
    this.ro = undefined;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const extraClass = this.name !== 'ids-modal' ? this.name : '';
    const extraContentClass = extraClass ? ` ${extraClass}-content` : '';
    const extraHeaderClass = extraClass ? ` ${extraClass}-header` : '';
    const extraFooterClass = extraClass ? ` ${extraClass}-footer` : '';
    const footerHidden = this.buttons.length ? '' : ' hidden';

    return `<ids-popup part="modal"
      class="ids-modal"
      type="modal"
      position-style="viewport">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header${extraHeaderClass}">
          <slot name="title"></slot>
        </div>
        <div class="ids-modal-content${extraContentClass}">
          <slot></slot>
        </div>
        <div class="ids-modal-footer${extraFooterClass}" ${footerHidden}>
          <slot name="buttons"></slot>
        </div>
      </div>
    </ids-popup>`;
  }

  private setResize() {
    if (typeof ResizeObserver === 'undefined') return;

    this.ro?.disconnect();

    if (!this.ro) {
      this.ro = new ResizeObserver(() => {
        this.setScrollable();
      });
    }

    this.ro.observe(this);
  }

  private setScrollable() {
    const el = this.modalContentEl;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight || el.scrollWidth > el.offsetWidth) this.modalContentEl?.classList.add('has-scrollbar');
  }

  /**
   * Used for ARIA Labels and other content
   * @readonly
   * @returns {string} concatenating the status and title together.
   */
  get ariaLabelContent(): string {
    let ariaLabel = this.messageTitle;
    if (!ariaLabel) ariaLabel = this.querySelector('ids-toolbar [type="title"]')?.textContent?.trim() || '';
    return ariaLabel;
  }

  /**
   * @readonly
   * @returns {NodeListOf<IdsModalButton> } currently slotted buttons
   */
  get buttons(): NodeListOf<IdsModalButton> {
    return this.querySelectorAll<IdsModalButton>('[slot="buttons"]');
  }

  /**
   * @readonly
   * @returns {HTMLElement | null} reference to the Modal's content wrapper element
   */
  get modalContentEl(): HTMLElement | null {
    return this.container?.querySelector('.ids-modal-content') || null;
  }

  /**
   * @returns {IdsModalFullsizeAttributeValue} the breakpoint at which
   * the Modal will change from normal mode to fullsize mode
   */
  get fullsize(): IdsModalFullsizeAttributeValue {
    return this.state.fullsize;
  }

  /**
   * @param {IdsModalFullsizeAttributeValue} val the breakpoint at which
   * the Modal will change from normal mode to fullsize mode
   */
  set fullsize(val: IdsModalFullsizeAttributeValue) {
    const current = this.fullsize;
    const makeFullsize = (doFullsize: boolean) => {
      if (!this.popup) return;

      this.popup.classList[doFullsize ? 'add' : 'remove'](attributes.FULLSIZE);
      this.popup.setAttribute(attributes.WIDTH, doFullsize ? '100%' : '');
      this.popup.setAttribute(attributes.HEIGHT, doFullsize ? '100%' : '');
      if (this.popup.place) this.popup.place();
      if (this.popup.open) {
        this.setScrollable();
        this.popup.correct3dMatrix();
      }
    };

    const safeVal = `${val}`;
    if (current !== val && this.popup) {
      switch (val) {
        case 'always':
          this.#clearBreakpointResponse();
          this.state.fullsize = 'always';
          this.popup?.classList.add(`can-fullsize`);
          makeFullsize(true);
          break;
        case null:
        case 'null':
        case '':
          this.state.fullsize = '';
          this.#clearBreakpointResponse();
          this.removeAttribute(attributes.FULLSIZE);
          this.popup?.classList.remove('can-fullsize');
          makeFullsize(false);
          break;
        default:
          if (Object.keys(breakpoints).includes(safeVal)) {
            this.state.fullsize = safeVal;
            this.setAttribute(attributes.FULLSIZE, safeVal);
            this.popup?.classList.add(`can-fullsize`);
            this.respondDown = safeVal;
            this.onBreakpointDownResponse = (detectedBreakpoint: keyof Breakpoints, matches: boolean) => {
              makeFullsize(matches);
            };
          }
          this.respondToCurrentBreakpoint();
          break;
      }
    }
  }

  set showCloseButton(val: boolean) {
    const show = stringToBool(stringToBool(val));

    if (this.showCloseButton === show) return;

    this.toggleAttribute(attributes.SHOW_CLOSE_BUTTON, show);
    if (show) {
      this.#attachCloseButton();
    } else {
      this.#removeCloseButton();
    }
  }

  get showCloseButton(): boolean {
    return this.hasAttribute(attributes.SHOW_CLOSE_BUTTON);
  }

  get closeButton(): HTMLElement | null {
    return this.container?.querySelector<HTMLElement>('.modal-control-close') ?? null;
  }

  /**
   * Removes established callbacks for responding to breakpoints, if set
   */
  #clearBreakpointResponse(): void {
    if (this.respondDown) {
      this.respondDown = null;
    }
    if (this.onBreakpointDownResponse) {
      this.onBreakpointDownResponse = undefined;
    }
  }

  /**
   * Runs on connectedCallback or any refresh to adjust the `fullsize` attribute, if set
   */
  #setFullsizeDefault(): void {
    // Default all Modals to `sm` fullsize
    if (this.hasAttribute(attributes.FULLSIZE)) {
      this.fullsize = this.getAttribute(attributes.FULLSIZE);
    } else {
      this.fullsize = 'sm';
    }
  }

  /**
   * Gets current overlay element
   * @returns {IdsOverlay} either an external overlay element, or none
   */
  get overlay(): IdsOverlay {
    return this.state.overlay || this.shadowRoot?.querySelector('ids-overlay');
  }

  /**
   * @param {IdsOverlay} val an overlay element
   */
  set overlay(val: IdsOverlay) {
    this.state.overlay = val instanceof HTMLElement ? val : null;
    this.#refreshOverlay();
  }

  /**
   * @returns {string} the content of the message's title
   */
  get messageTitle(): string {
    const titleEl = this.querySelector('[slot="title"]');
    return titleEl?.textContent || this.state.messageTitle;
  }

  /**
   * @param {string} val the new content to be used as the message's title
   */
  set messageTitle(val: string) {
    const trueVal = this.xssSanitize(val);
    const currentVal = this.state.messageTitle;

    if (currentVal === trueVal) return;

    if (typeof trueVal === 'string' && trueVal.length) {
      this.state.messageTitle = trueVal;
      this.setAttribute(attributes.MESSAGE_TITLE, trueVal);
    } else {
      this.state.messageTitle = '';
      this.removeAttribute(attributes.MESSAGE_TITLE);
    }

    this.#refreshModalHeader(!!trueVal);
  }

  /**
   * Sets modal scrollable setting
   * @param {boolean|string} val scrollable flag
   */
  set scrollable(val: boolean | string) {
    const isScrollable = stringToBool(val);
    this.toggleAttribute(attributes.SCROLLABLE, isScrollable);
    this.container?.classList.toggle(attributes.SCROLLABLE, isScrollable);
    this.state.scrollable = isScrollable;
  }

  /**
   * Gets modal scrollable setting
   * @returns {boolean} scrollable flag
   */
  get scrollable(): boolean {
    return this.state.scrollable;
  }

  /**
   * Refreshes the state of the Modal header, either adding its slot/contents or removing it
   * @param {boolean} hasTitle true if the title should be rendered
   * @returns {void}
   */
  #refreshModalHeader(hasTitle: boolean): void {
    const titleEls = [...this.querySelectorAll('[slot="title"]')];

    // Search for slotted title elements.
    // If one is found, replace the contents. Otherwise, create one.
    if (!hasTitle) {
      this.querySelectorAll('[slot="title"]').forEach((el) => el.remove());
    } else if (titleEls.length) {
      titleEls[0].textContent = this.state.messageTitle;
      titleEls.slice(1).forEach((el) => el.remove());
    } else {
      this.insertAdjacentHTML('afterbegin', `<ids-text slot="title" type="h2" font-size="24">${this.state.messageTitle}</ids-text>`);
    }

    this.refreshAriaLabel();
  }

  /**
   * Renders or Removes a correct `aria-label` attribute on the Modal about its contents.
   * @returns {void}
   */
  refreshAriaLabel(): void {
    const title = this.ariaLabelContent;
    if (title) {
      this.setAttribute('aria-label', title);
      return;
    }
    this.removeAttribute('aria-label');
  }

  /**
   * Refreshes the state of the Modal footer, hiding/showing it
   * @returns {void}
   */
  #refreshModalFooter() {
    if (!this.container) return;
    const footerEl = this.container.querySelector('.ids-modal-footer');

    if (this.buttons.length) {
      footerEl?.removeAttribute('hidden');
    } else {
      footerEl?.setAttribute('hidden', '');
    }
  }

  /**
   * @returns {boolean} true if the Modal is visible.
   */
  get visible(): boolean {
    return this.#visible;
  }

  /**
   * @param {boolean|string} val true if the Modal is visible.
   */
  set visible(val: boolean | string | null) {
    const trueVal = stringToBool(val);
    if (this.#visible !== trueVal) {
      this.#visible = trueVal;
      this.toggleAttribute(attributes.VISIBLE, trueVal);
      this.#refreshVisibility(trueVal);
    }
  }

  /**
   * Shows the modal with possibity to veto the promise
   * @returns {Promise<void> }
   */
  async show(): Promise<void> {
    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    // Setting the value reruns this method, so exit afterward
    if (!this.visible) {
      this.visible = true;
      return;
    }

    // Check if buttons have been added/removed, and adjust the footer visibility (if applicable)
    if (this.container) {
      const footer = this.container.querySelector('.ids-modal-footer');
      footer?.toggleAttribute(attributes.HIDDEN, !this.buttons.length);
    }

    // Animation-in needs the Modal to appear in front (z-index), so this occurs on the next tick
    this.style.setProperty('z-index', String(++IdsModal.zCount));
    if (this.overlay) this.overlay.visible = true;
    if (this.popup) {
      this.popup.visible = true;
      if (this.popup.animated && this.popup.container) {
        await waitForTransitionEnd(this.popup.container, 'opacity');
      }
      this.setScrollable();
      this.popup.correct3dMatrix();
    }
    if (this.overlay) this.overlay.visible = true;
    this.removeAttribute('aria-hidden');

    // Focus the correct element
    this.capturesFocus = true;
    if (this.autoFocus) {
      this.setFocus(this.#getFocusableElementIndex());
    }

    this.addOpenEvents();
    this.triggerEvent('show', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });

    if (this.popup) {
      this.popup.removeAttribute('animated');
    }

    this.respondToCurrentBreakpoint();

    this.triggerEvent('aftershow', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });
  }

  /**
   * Hides the modal with possibity to veto the promise
   * @returns {Promise<void>}
   */
  async hide(): Promise<void> {
    // Trigger a veto-able `beforehide` event.
    if (!this.triggerVetoableEvent('beforehide')) return;

    // Setting the value reruns this method, so exit afterward
    if (this.visible) {
      this.visible = false;
      return;
    }

    const popupElem = this.popup;

    if (popupElem && popupElem.getAttribute('animated') === 'true') popupElem.animated = true;

    this.removeOpenEvents();
    if (this.overlay) this.overlay.visible = false;
    if (popupElem) popupElem.visible = false;

    // Animation-out can wait for the opacity transition to end before changing z-index.
    if (popupElem && popupElem.container && popupElem.animated) {
      await waitForTransitionEnd(popupElem.container, 'opacity');
    }
    this.style.zIndex = '';
    this.setAttribute('aria-hidden', 'true');
    --IdsModal.zCount;

    // Disable focus capture
    this.capturesFocus = false;

    this.triggerEvent('hide', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });

    this.#setTargetFocus();

    this.triggerEvent('afterhide', this, {
      bubbles: true,
      detail: {
        elem: this
      }
    });
  }

  /**
   * Overrides `addOpenEvents` from the OpenEvents mixin to add additional "Escape" key handling
   * @private
   */
  addOpenEvents(): void {
    this.removeOpenEvents();

    // Adds a global event listener for the Keydown event on the body to capture close via Escape
    // (NOTE cannot use IdsEventsMixin here due to scoping)
    document.addEventListener('keydown', this.globalKeydownListener);

    // If a Modal Button is clicked, fire an optional callback
    const buttonSlot = this.container?.querySelector('slot[name="buttons"]');
    this.offEvent('click.buttons');
    this.onEvent('click.buttons', buttonSlot, async (e: MouseEvent) => {
      await this.handleButtonClick(e);
    });
  }

  /**
   * Overrides `removeOpenEvents` from the OpenEvents mixin to remove "Escape" key handling
   * @private
   */
  removeOpenEvents(): void {
    document.removeEventListener('keydown', this.globalKeydownListener);
    this.unlisten('Escape');
    this.offEvent('click.buttons');
  }

  /**
   * Refreshes the state of the overlay used behind the modal.  If a shared overlay isn't applied,
   * an internal one is generated and applied to the ShadowRoot.
   * @returns {void}
   */
  #refreshOverlay(): void {
    const externalOverlay = this.state.overlay;
    this.shadowRoot?.querySelector('ids-overlay')?.remove();
    this.shadowRoot?.prepend(externalOverlay || new IdsOverlay());
  }

  /**
   * @param {boolean} val if true, makes the Modal visible to the user
   * @returns {void}
   */
  #refreshVisibility(val: boolean): void {
    if (val) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.show();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.hide();
    }
  }

  /**
   * Focuses the defined target element, if applicable
   * @returns {void}
   */
  #setTargetFocus(): void {
    if (this.target) {
      this.target.focus();
    }
  }

  /**
   * Runs calculation-sensitive routines when the entire DOM has loaded
   */
  async #setFocusIfVisible() {
    this.visible = this.getAttribute('visible');
    if (this.visible && this.autoFocus) {
      this.setFocus(this.#getFocusableElementIndex());
    }
  }

  /**
   * Sets up overall events
   * @private
   */
  attachEventHandlers(): void {
    const titleSlot = this.container?.querySelector<HTMLSlotElement>('slot[name="title"]');
    const buttonSlot = this.container?.querySelector<HTMLSlotElement>('slot[name="buttons"]');

    // Stagger these one frame to prevent them from occuring
    // immediately when the component invokes
    window.requestAnimationFrame(() => {
      this.offEvent('slotchange.title', titleSlot);
      this.onEvent('slotchange.title', titleSlot, () => {
        const titleNodes = titleSlot?.assignedElements();

        if (titleNodes?.length) {
          this.messageTitle = titleNodes[0].textContent ?? '';
          titleNodes.slice(1).forEach((elem) => elem.remove());
        }
      });

      this.offEvent('slotchange.buttonset', buttonSlot);
      this.onEvent('slotchange.buttonset', buttonSlot, () => {
        this.#refreshModalFooter();
      });

      if (this.visible) {
        this.addOpenEvents();
      }
    });

    // Set up all the events specifically-related to the "trigger" type
    this.refreshTriggerEvents();
  }

  /**
   * Handles when Modal Button is clicked.
   * @param {any} e the original event object
   */
  async handleButtonClick(e: any): Promise<void> {
    await cssTransitionTimeout(200);

    if (typeof this.onButtonClick === 'function') {
      this.onButtonClick(e.target);
    }

    // If this IdsModalButton has a `cancel` prop, treat
    // it as a `cancel` button and hide.
    const modalBtn = e.target.closest('ids-modal-button');
    if (modalBtn?.cancel) {
      await this.hide();
    }
  }

  /**
   * Handle `onTriggerClick` from IdsPopupInteractionsMixin
   * @returns {void}
   */
  onTriggerClick(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.show();
  }

  /**
   * Handle `onOutsideClick` from IdsPopupOpenEventsMixin
   * @param {MouseEvent} e the original click event
   * @returns {void}
   */
  onOutsideClick(e: MouseEvent): void {
    if (!e?.target || e.composedPath()?.includes(this.popup as HTMLElement)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.hide();
  }

  /**
   * click-outside-to-close attribute
   * @returns {boolean} clickOutsideToClose param converted to boolean from attribute value
   */
  get clickOutsideToClose(): boolean {
    return stringToBool(this.getAttribute(attributes.CLICK_OUTSIDE_TO_CLOSE));
  }

  /**
   * Set whether or not to allow the modal to close by clicking outside
   * @param {boolean | string | null} val click-outside-to-close attribute value
   */
  set clickOutsideToClose(val: boolean | string | null) {
    const boolVal = stringToBool(val);
    if (boolVal) {
      this.popup!.onOutsideClick = this.onOutsideClick.bind(this);
    } else {
      this.popup!.onOutsideClick = () => {};
    }
    this.toggleAttribute(attributes.CLICK_OUTSIDE_TO_CLOSE, boolVal);
  }

  /**
   * Add button with icon to the modal
   * Reusing ids-modal-button component with cancel attribute and extra css class to change appearance
   */
  #attachCloseButton() {
    this.#removeCloseButton();

    const element = `<ids-modal-button
      class="modal-control-close"
      slot="buttons"
      appearance="tertiary"
      css-class="ids-icon-button ids-modal-icon-button"
      cancel>
      <span class="audible">Close modal</span>
      <ids-icon icon="close"></ids-icon>
    </ids-modal-button>`;

    this.container?.querySelector('.ids-modal-container')?.insertAdjacentHTML('afterbegin', element);

    // attach close button handler
    this.onEvent('click.modal-close', this.closeButton, () => this.hide());
  }

  #removeCloseButton() {
    const closeButton = this.closeButton;
    this.offEvent('click.modal-close', closeButton);
    closeButton?.remove();
  }

  /**
   * @returns {number} the index of the first focusable element in the modal content skipping the toolbar
   */
  #getFocusableElementIndex(): number {
    return this.focusableElements?.findIndex((item: HTMLElement) => !getClosest(item, 'ids-toolbar')) || 0;
  }
}
