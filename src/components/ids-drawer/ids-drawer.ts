// Import Core
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { EDGES, TYPES } from './ids-drawer-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-drawer.scss';

const Base = IdsPopupOpenEventsMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Drawer Component
 * @type {IdsDrawer}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsPopupOpenEventsMixin
 */
@customElement('ids-drawer')
@scss(styles)
export default class IdsDrawer extends Base {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
    this.state.edge = null;
    this.state.target = null;
    this.state.type = null;
    this.state.visible = false;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.EDGE,
      attributes.TYPE,
      attributes.VISIBLE
    ];
  }

  template(): string {
    return `<div class="ids-drawer">
      <slot></slot>
    </ids-drawer>`;
  }

  /**
   * @returns {string} the current Edge that the Drawer is displayed against
   */
  get edge(): string {
    return this.state.edge;
  }

  /**
   * @param {string} val changes the Edge that the Drawer is displayed against
   */
  set edge(val: string) {
    let trueVal = EDGES[0];
    if (typeof val === 'string' && EDGES.includes(val)) {
      trueVal = val;
    }

    if (this.state.edge !== trueVal) {
      this.state.edge = trueVal;
      this.setAttribute(attributes.EDGE, `${trueVal}`);
      this.#refreshEdgeClass();
    }
  }

  /**
   * Refreshes the visual state of the Drawer related to its Edge
   * @returns {void}
   */
  #refreshEdgeClass(): void {
    const cl = this.container?.classList;
    const edgeClass = `edge-${this.edge}`;
    EDGES.forEach((edge) => {
      const thisEdgeClass = `edge-${edge}`;
      if (edgeClass === thisEdgeClass && !cl?.contains(edgeClass)) {
        cl?.add(edgeClass);
      } else if (edgeClass !== thisEdgeClass && cl?.contains(thisEdgeClass)) {
        cl?.remove(thisEdgeClass);
      }
    });
  }

  /**
   * @returns {HTMLElement} the target element's reference
   */
  get target(): HTMLElement {
    return this.state.target;
  }

  /**
   * @param {HTMLElement} val a target element's reference
   */
  set target(val: HTMLElement) {
    if (val !== this.state.target) {
      this.removeTriggerEvents();
      this.state.target = val;
      this.refreshTriggerEvents();
    }
  }

  /** Describes whether or not this drawer has trigger events */
  hasTriggerEvents = false;

  /**
   * Removes events from a trigger element
   */
  removeTriggerEvents(): void {
    const removeEventTargets = ['click.trigger'];
    removeEventTargets.forEach((eventName) => {
      const evt = this.handledEvents.get(eventName);
      if (evt) {
        this.detachEventsByName(eventName);
      }
    });
    this.hasTriggerEvents = false;
  }

  /**
   * Attaches events to the trigger element
   */
  refreshTriggerEvents(): void {
    if (!this.target) {
      return;
    }
    this.onEvent('click.trigger', this.target, () => {
      // Closes the popup for app menu
      if (this.type === TYPES[0] && this.visible) {
        this.hide();
      } else {
        this.show();
      }
    });
  }

  /**
   * @returns {string} the current display type of the Drawer
   */
  get type(): string {
    return this.state.type;
  }

  /**
   * @param {string} val changes the display type of the Drawer
   */
  set type(val: string) {
    let trueVal = null;
    if (typeof val === 'string' && TYPES.includes(val)) {
      trueVal = val;
    }

    if (this.state.type !== trueVal) {
      this.state.type = trueVal;
      if (trueVal) {
        this.setAttribute(attributes.TYPE, `${trueVal}`);
      } else {
        this.removeAttribute(attributes.TYPE);
      }
      this.#refreshTypeClass();
    }
  }

  /**
   * Refreshes the visual state of the Drawer related to its type
   * @returns {void}
   */
  #refreshTypeClass(): void {
    const cl = this.container?.classList;
    const typeClass = `type-${this.type}`;
    TYPES.forEach((type) => {
      const thisTypeClass = `type-${type}`;
      if (this.type !== null && typeClass === thisTypeClass && !cl?.contains(typeClass)) {
        cl?.add(typeClass);
      } else if (typeClass !== thisTypeClass && cl?.contains(thisTypeClass)) {
        cl?.remove(thisTypeClass);
      }
    });
  }

  /**
   * @returns {boolean} true if the Drawer is currently visible
   */
  get visible(): boolean {
    return stringToBool(this.state.visible);
  }

  /**
   * @param {boolean | string} val true if the Drawer should become visible
   */
  set visible(val: boolean | string) {
    const trueVal = stringToBool(val);
    if (trueVal) {
      this.setAttribute(attributes.VISIBLE, stripHTML(`${val}`));
    } else {
      this.removeAttribute(attributes.VISIBLE);
    }

    if (this.state.visible !== trueVal) {
      this.state.visible = trueVal;
      this.#refreshVisibility();
    }
  }

  /**
   * Changes visual state related to the Drawer's visibility
   * @returns {void}
   */
  #refreshVisibility(): void {
    if (this.visible) {
      this.container?.classList.add('visible');
      this.addOpenEvents();
      this.triggerEvent('show', this, {
        bubbles: true,
        detail: { elem: this }
      });
    } else {
      this.container?.classList.remove('visible');
      this.removeOpenEvents();
      this.triggerEvent('hide', this, {
        bubbles: true,
        detail: { elem: this }
      });
    }
  }

  /**
   * @returns {Array<string>} Drawer vetoable events
   */
  vetoableEventTypes: Array<string> = ['beforeshow', 'beforehide'];

  /**
   * Shows the drawer
   */
  show(): void {
    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    this.visible = true;
  }

  /**
   * Hides the drawer
   */
  hide(): void {
    // Trigger a veto-able `beforehide` event.
    if (!this.triggerVetoableEvent('beforehide')) {
      return;
    }

    this.visible = false;
  }

  /**
   * Handle `onOutsideClick` from IdsPopupOpenEventsMixin
   * @param {MouseEvent} e the original click event
   */
  onOutsideClick(e: MouseEvent): void {
    if (this.isEqualNode(e.target as Node) || this.contains(e.target as Node)) {
      return;
    }
    this.hide();
  }
}
