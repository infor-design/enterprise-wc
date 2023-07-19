import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-button/ids-button';
import type IdsButton from '../ids-button/ids-button';

import styles from './ids-scroll-view.scss';

const Base = IdsKeyboardMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Scroll View Component
 * @type {IdsScrollView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @part container - the parent container element
 * @part scroll-view - the scrolling container
 * @part controls - the control button area
 * @part button - the individual circle buttons in the scroll view
 */
@customElement('ids-scroll-view')
@scss(styles)
export default class IdsScrollView extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.LOOP,
      attributes.SHOW_TOOLTIP,
      attributes.SUPPRESS_CONTROLS
    ];
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.#renderCircleButtons();
    this.#attachEventHandlers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template(): string {
    let controlsClass = 'ids-scroll-view-controls';
    if (this.suppressControls) controlsClass += ` ${attributes.SUPPRESS_CONTROLS}`;

    return `<div class="ids-scroll-view-container" part="container">
      <div class="ids-scroll-view" part="scroll-view" role="complementary" tabindex="-1">
        <slot name="scroll-view-item"></slot>
      </div>
      <div class="${controlsClass}" part="controls" role="tablist"></div>
    </div>`;
  }

  /**
   * @returns {Array<string>} Drawer vetoable events
   */
  vetoableEventTypes = [
    'beforefirst',
    'beforeprevious',
    'beforenext',
    'beforelast',
    'beforeslideto'
  ];

  /**
   * Current active slide index
   * @private
   */
  #activeNumber = 0;

  /**
   * State of action by click or keyboard
   * @private
   */
  #isClickOrKey = false;

  /**
   * Get the list of circle buttons
   * @returns {IdsButton[]} The list of circle buttons
   */
  get circleButtons(): IdsButton[] {
    return [...(this.controls?.querySelectorAll<IdsButton>('.circle-button') ?? [])];
  }

  /**
   * Get the controls container
   * @returns {HTMLElement|null} The controls container element
   */
  get controls(): HTMLElement | null | undefined {
    return this.shadowRoot?.querySelector('.ids-scroll-view-controls');
  }

  /**
   * Set the loop, true will loop back after next/previous reached to end
   * @param {boolean} value The value
   */
  set loop(value: boolean) {
    const val = stringToBool(value);
    if (val === this.loop) return;
    if (val) this.setAttribute(attributes.LOOP, '');
    else this.removeAttribute(attributes.LOOP);
  }

  get loop(): boolean {
    return this.hasAttribute(attributes.LOOP);
  }

  /**
   * Set the tooltip for circle buttons
   * @param {boolean} value The value
   */
  set showTooltip(value: boolean) {
    const val = stringToBool(value);
    if (val === this.showTooltip) return;
    if (val) this.setAttribute(attributes.SHOW_TOOLTIP, '');
    else this.removeAttribute(attributes.SHOW_TOOLTIP);
    this.#setTooltip();
  }

  get showTooltip(): boolean {
    return this.hasAttribute(attributes.SHOW_TOOLTIP);
  }

  /**
   * Set suppress controls for circle buttons
   * @param {boolean} value The value
   */
  set suppressControls(value: boolean) {
    const val = stringToBool(value);
    if (val === this.suppressControls) return;
    if (val) {
      this.setAttribute(attributes.SUPPRESS_CONTROLS, '');
      this.controls?.classList.add(attributes.SUPPRESS_CONTROLS);
    } else {
      this.removeAttribute(attributes.SUPPRESS_CONTROLS);
      this.controls?.classList.remove(attributes.SUPPRESS_CONTROLS);
    }
  }

  get suppressControls(): boolean {
    return this.hasAttribute(attributes.SUPPRESS_CONTROLS);
  }

  /**
   * Move to first slide
   * @returns {void}
   */
  first(): void {
    const args = { activeNumber: this.#activeNumber };
    if (!this.triggerVetoableEvent('beforefirst', args)) return;

    if (this.#activeNumber !== 0) this.#setActive(0, true, true);
  }

  /**
   * Move to previous slide
   * @returns {void}
   */
  previous(): void {
    let num = this.#activeNumber;
    const args = { activeNumber: num };
    if (!this.triggerVetoableEvent('beforeprevious', args)) return;

    if (num <= 0) {
      if (!this.loop) return;
      num = this.circleButtons.length - 1;
    } else num--;

    if (num !== this.#activeNumber) this.#setActive(num, true, true);
  }

  /**
   * Move to next slide
   * @returns {void}
   */
  next(): void {
    let num = this.#activeNumber;
    const args = { activeNumber: num };
    if (!this.triggerVetoableEvent('beforenext', args)) return;

    if (num >= (this.circleButtons.length - 1)) {
      if (!this.loop) return;
      num = 0;
    } else num++;

    if (num !== this.#activeNumber) this.#setActive(num, true, true);
  }

  /**
   * Move to lst slide
   * @returns {void}
   */
  last(): void {
    let num = this.#activeNumber;
    const args = { activeNumber: num };
    if (!this.triggerVetoableEvent('beforelast', args)) return;

    num = this.circleButtons.length - 1;
    if (num !== this.#activeNumber) this.#setActive(num, true, true);
  }

  /**
   * Slide to given slide number
   * @param {number|string} slideNumber The slide number
   * @returns {void}
   */
  slideTo(slideNumber?: number | string): void {
    const args = { activeNumber: this.#activeNumber, slideTo: slideNumber };
    if (!this.triggerVetoableEvent('beforeslideto', args)) return;

    this.#setActive(slideNumber, true, true);
  }

  /**
   * Get the current slide number
   * @returns {number | undefined} the current slide number
   */
  currentSlideNumber(): number | undefined {
    const container = this.container;
    let val;
    if (container) {
      val = container.scrollLeft / container.offsetWidth;
      if (this.localeAPI?.isRTL()) val *= -1;
    }
    return (typeof val === 'number' && !Number.isNaN(val)) ? Math.trunc(val) : undefined;
  }

  /**
   * Move to the given slide number
   * @private
   * @param {number|string} slideNumber The slide number to move
   * @returns {void}
   */
  #moveTo(slideNumber?: number | string): void {
    const container = this.container;
    const num = parseInt((slideNumber as string), 10);

    if (container && !Number.isNaN(num)) {
      let val = container.offsetWidth * num;
      if (this.localeAPI?.isRTL()) val *= -1;

      const left = val - container.scrollLeft;
      if (left) {
        container.scrollBy({ left });
        this.triggerEvent('scrolled', this, {
          detail: { elem: this, activeNumber: this.#activeNumber, left }
        });
      }
    }
  }

  /**
   * Set tooltips for circle buttons
   * @private
   * @returns {void}
   */
  #setTooltip(): void {
    this.circleButtons.forEach((btn) => {
      if (this.showTooltip) btn.setAttribute('tooltip', (btn.text || '').trim());
      else btn.removeAttribute('tooltip');
      btn.handleTooltipEvents();
    });
  }

  /**
   * Render the circle buttons
   * @private
   * @returns {void}
   */
  #renderCircleButtons(): void {
    if (this.controls) this.controls.innerHTML = '';

    this.querySelectorAll('[slot]').forEach((item, i) => {
      const cssClass = ` class="circle-button${i === 0 ? ' selected' : ''}"`;
      const ariaSelected = i === 0 ? ' aria-selected="true"' : '';
      const label = item.getAttribute('label') || item.getAttribute('alt') || '';
      const tooltip = this.showTooltip ? `tooltip="${label}"` : '';

      this.controls?.insertAdjacentHTML('beforeend', `
        <ids-button data-slide-number="${i}" part="button" exportparts="button: scroll-view-button" role="tab"${cssClass}${ariaSelected}${tooltip}>
          <ids-icon icon="filter-not-selected"></ids-icon>
          <span class="audible">${label}</span>
        </ids-button>`);
    });
  }

  /**
   * Set as active slide and optionly set focus
   * @private
   * @param {number | string} slideNumber The slide number
   * @param {boolean} isMove If true, set to move
   * @param {boolean} isFocus If true, set to focus
   * @returns {void}
   */
  #setActive(slideNumber?: number | string, isMove = false, isFocus = false): void {
    const buttons = this.circleButtons;
    const num = parseInt((slideNumber as string), 10);

    if (!Number.isNaN(num) && num !== this.#activeNumber) {
      const active = buttons[this.#activeNumber];
      const btn = buttons[num];
      this.#activeNumber = num;

      active?.classList.remove('selected');
      active?.removeAttribute('aria-selected');

      btn?.classList.add('selected');
      btn?.setAttribute('aria-selected', 'true');

      if (isMove) this.#moveTo(num);
      if (isFocus) btn?.focus();
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    // Handle click event
    this.offEvent('click.scrollview', this.controls);
    this.onEvent('click.scrollview', this.controls, (e: MouseEvent) => {
      e.preventDefault();
      this.#isClickOrKey = true;
      this.#setActive((e.target as any)?.getAttribute('data-slide-number'), true, false);
    });

    // Handle arrow keys
    this.unlisten('ArrowLeft');
    this.unlisten('ArrowRight');
    this.unlisten('Enter');
    this.listen(['ArrowLeft', 'ArrowRight', 'Enter'], this.controls, (e: any) => {
      this.#isClickOrKey = true;

      if (e.key === 'ArrowLeft') this.previous();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    const itemSlot = this.container?.querySelector(`slot[name="scroll-view-item"]`);
    this.offEvent('click.scrollview', itemSlot);
    this.onEvent('slotchange', itemSlot, () => this.#renderCircleButtons());

    // Handle scroll-end, after snap scrolling event is complete
    // https://stackoverflow.com/a/66029649
    this.offEvent('scroll.scrollview', this.container);
    this.onEvent('scroll.scrollview', this.container, (e: any) => {
      const target = e.target;
      if (target && (target.scrollLeft % target.offsetWidth === 0)) {
        if (!this.#isClickOrKey) this.#setActive(this.currentSlideNumber(), false, true);
        this.#isClickOrKey = false;
      }
    });
  }
}
