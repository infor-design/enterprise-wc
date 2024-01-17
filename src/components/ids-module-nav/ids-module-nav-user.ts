import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';

import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

import type IdsHyperlink from '../ids-hyperlink/ids-hyperlink';
import type IdsText from '../ids-text/ids-text';

import styles from './ids-module-nav-user.scss';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';

const Base = IdsModuleNavTextDisplayMixin(
  IdsModuleNavDisplayModeMixin(
    IdsColorVariantMixin(
      IdsLocaleMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

/**
 * IDS Module Nav User Component
 * @type {IdsModuleNavUser}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsModuleNavDisplayModeMixin
 * @mixes IdsModuleNavTextDisplayMixin
 * @part expander - this accoridon header's expander button element
 * @part header - the accordion header's root element
 * @part icon - the accordion header's icon element
 */
@customElement('ids-module-nav-user')
@scss(styles)
export default class IdsModuleNavUser extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  template() {
    return `<div class="ids-module-nav-user">
      <div class="ids-module-nav-user-avatar">
        <slot name="avatar"></slot>
      </div>
      <div class="ids-module-nav-user-details">
        <slot></slot>
      </div>
    </div>`;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [...super.attributes];
  }

  /**
   * @readonly
   * @returns {Array<IdsHyperlink | IdsText | HTMLSpanElement>} this Accordion Header's text node
   */
  get textNodes(): Array<IdsHyperlink | IdsText | HTMLSpanElement> {
    return [...this.querySelectorAll<IdsHyperlink | IdsText | HTMLSpanElement>('ids-text, span')] || [];
  }

  /**
   * @param {string | undefined | null} variantName name of the new colorVariant
   */
  onColorVariantRefresh(variantName?: string | undefined | null): void {
    if (this.textNodes.length) {
      this.textNodes.forEach((el) => {
        if (el.tagName === 'IDS-TEXT') {
          (el as IdsText).colorVariant = variantName ?? null;
        }
      });
    }
  }

  onDisplayModeChange() {
    this.#refreshTextNodes();
  }

  #refreshTextNodes() {
    const visibleCondition = this.displayMode !== 'expanded';
    this.#updateTextNodeVisibility(visibleCondition);
  }

  #updateTextNodeVisibility(val: boolean) {
    if (this.textNodes.length) {
      this.textNodes.forEach((el) => {
        if (el.tagName === 'IDS-HYPERLINK') {
          (el as IdsHyperlink).hidden = val;
        }
        if (el.tagName === 'IDS-TEXT') {
          (el as IdsText).audible = val;
        }
        if (el.tagName === 'SPAN') {
          (el as HTMLSpanElement).classList.toggle('audible', val);
        }
      });
    }
  }

  onTextDisplayChange(val: string) {
    console.info(`text display change from header: "${this.textContent?.trim() || ''}"`, val);
    this.#updateTextNodeVisibility(val !== 'default');
  }
}
