import { attributes, Breakpoints } from '../../core/ids-attributes';
import { isWidthAbove } from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';

type IdsBreakpointRespondAttribute = keyof Breakpoints | null;

/**
 * A mixin that repsonds to breakpoint changes
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsBreakpointMixin = (superclass: any): any => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.RESPOND_UP,
      attributes.RESPOND_DOWN,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#teardownRespondUp();
  }

  // ===============================================
  // Respond Up

  #mqUp?: MediaQueryList;

  #mqUpChangeHandler?: ((e: MediaQueryListEvent) => void) | any;

  onBreakpointUpResponse?: (val: keyof Breakpoints, matches: boolean) => void;

  set respondUp(val: IdsBreakpointRespondAttribute) {
    if (val) {
      this.setAttribute(attributes.RESPOND_UP, val);
      this.#setupRespondUp(val);
    } else {
      this.removeAttribute(attributes.RESPOND_UP);
      this.#teardownRespondUp();
    }
  }

  get respondUp(): IdsBreakpointRespondAttribute {
    return this.getAttribute(attributes.RESPOND_UP);
  }

  #setupRespondUp(val: keyof Breakpoints) {
    this.#mqUp = isWidthAbove(val);
    this.#mqUpChangeHandler = (e: MediaQueryListEvent): void => {
      if (typeof this.onBreakpointUpResponse === 'function') {
        this.onBreakpointUpResponse(val, e.matches);
      }
    };

    this.#mqUp.addEventListener('change', this.#mqUpChangeHandler);
  }

  #teardownRespondUp() {
    if (this.#mqUp) {
      this.#mqUp.removeEventListener('change', this.#mqUpChangeHandler);
      this.#mqUpChangeHandler = undefined;
      this.#mqUp = undefined;
    }
  }

  // ===============================================
  // Respond Down

  // ===============================================
  // General

  respondToCurrentBreakpoint(): void {
    if (this.#mqUp) {
      this.#mqUp.dispatchEvent(new MediaQueryListEvent('change', { bubbles: true }));
    }
  }
};

export default IdsBreakpointMixin;
