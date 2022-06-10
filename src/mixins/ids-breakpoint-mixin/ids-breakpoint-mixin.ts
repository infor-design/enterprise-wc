import { attributes, Breakpoints } from '../../core/ids-attributes';
import { isWidthAbove, isWidthBelow } from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';

type IdsBreakpointRespondAttribute = keyof Breakpoints | null;
type IdsBreakpointResponseCallback = (val: keyof Breakpoints, matches: boolean) => void;

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
    this.#teardownRespondDown();
  }

  // ===============================================
  // Respond Up

  #mqUp?: MediaQueryList | any;

  #mqUpChangeHandler?: ((e: MediaQueryListEvent | any) => void) | any;

  onBreakpointUpResponse?: IdsBreakpointResponseCallback;

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
    this.#teardownRespondUp();
    this.#mqUp = isWidthAbove(val);
    this.#mqUpChangeHandler = (e: MediaQueryListEvent | any): void => {
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

  #mqDown?: MediaQueryList;

  #mqDownChangeHandler?: ((e: MediaQueryListEvent | any) => void) | any;

  onBreakpointDownResponse?: IdsBreakpointResponseCallback;

  set respondDown(val: IdsBreakpointRespondAttribute) {
    if (val) {
      this.setAttribute(attributes.RESPOND_DOWN, val);
      this.#setupRespondDown(val);
    } else {
      this.removeAttribute(attributes.RESPOND_DOWN);
      this.#teardownRespondDown();
    }
  }

  get respondDown(): IdsBreakpointRespondAttribute {
    return this.getAttribute(attributes.RESPOND_DOWN);
  }

  #setupRespondDown(val: keyof Breakpoints) {
    this.#teardownRespondDown();
    this.#mqDown = isWidthBelow(val);
    this.#mqDownChangeHandler = (e: MediaQueryListEvent | any): void => {
      if (typeof this.onBreakpointDownResponse === 'function') {
        this.onBreakpointDownResponse(val, e.matches);
      }
    };

    this.#mqDown.addEventListener('change', this.#mqDownChangeHandler);
  }

  #teardownRespondDown() {
    if (this.#mqDown) {
      this.#mqDown.removeEventListener('change', this.#mqDownChangeHandler);
      this.#mqDownChangeHandler = undefined;
      this.#mqDown = undefined;
    }
  }

  // ===============================================
  // General

  respondToCurrentBreakpoint(): void {
    const simulateChangeEvent = (mq: MediaQueryList | any) => new MediaQueryListEvent('change', {
      bubbles: true,
      matches: mq.matches
    });

    if (this.#mqUp) {
      this.#mqUp.dispatchEvent(simulateChangeEvent(this.#mqUp));
    }
    if (this.#mqDown) {
      this.#mqDown.dispatchEvent(simulateChangeEvent(this.#mqDown));
    }
  }
};

export default IdsBreakpointMixin;
