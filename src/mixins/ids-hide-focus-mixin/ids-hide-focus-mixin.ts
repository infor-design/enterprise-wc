import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

type Constraints = IdsConstructor<EventsMixinInterface>;

const IdsHideFocusMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.HIDE_FOCUS
    ];
  }

  #isClick = false;

  #isFocused = false;

  connectedCallback() {
    super.connectedCallback?.();

    if (this.hideFocus) {
      this.#attachHideFocusEvents();
      this.#addCssClass();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#removeHideFocusEvents();
  }

  #attachHideFocusEvents() {
    this.#removeHideFocusEvents();

    this.onEvent('focusin.hide-focus', this, (e) => {
      if (!this.#isClick && !this.#isFocused) {
        this.#removeCssClass();
        this.triggerEvent('hidefocusremove', this, e);
      }
      this.#isClick = false;
      this.#isFocused = true;
    });
    this.onEvent('focusout.hide-focus', this, (e) => {
      this.#addCssClass();

      this.#isClick = false;
      this.#isFocused = false;

      this.triggerEvent('hidefocusadd', this, e);
    });
    this.onEvent('mousedown.hide-focus', this, (e) => {
      this.#isClick = true;
      this.#addCssClass();
      this.triggerEvent('hidefocusadd', this, e);
    });
  }

  #removeHideFocusEvents() {
    this.offEvent('focusin.hide-focus');
    this.offEvent('focusout.hide-focus');
    this.offEvent('mousedown.hide-focus');
  }

  #addCssClass() {
    this.container?.classList.add('hide-focus');
  }

  #removeCssClass() {
    this.container?.classList.remove('hide-focus');
  }

  set hideFocus(value: string | boolean | null) {
    const boolVal = stringToBool(value);
    this.setAttribute(attributes.HIDE_FOCUS, String(boolVal));

    if (boolVal) {
      this.#addCssClass();
      this.#attachHideFocusEvents();
    } else {
      this.#removeCssClass();
      this.#removeHideFocusEvents();
    }
  }

  get hideFocus(): boolean {
    const attrVal = this.getAttribute(attributes.HIDE_FOCUS);

    return attrVal ? stringToBool(attrVal) : true;
  }
};

export default IdsHideFocusMixin;
