import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { getClosest, waitForTransitionEnd } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsElement from '../../core/ids-element';

import '../ids-modal/ids-overlay';
import type IdsOverlay from '../ids-modal/ids-overlay';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';

import styles from './ids-module-nav-content.scss';

import type IdsModuleNav from './ids-module-nav';

const Base = IdsModuleNavDisplayModeMixin(
  IdsElement
);

/**
 * IDS Module Nav Component
 * @type {IdsModuleNavContent}
 * @inherits IdsElement
 * @mixes IdsModuleNavDisplayModeMixin
 */
@customElement('ids-module-nav-content')
@scss(styles)
export default class IdsModuleNavContent extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.OFFSET_CONTENT
    ];
  }

  template() {
    return `<div class="ids-module-nav-content">
      <ids-overlay></ids-overlay>
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsModuleNav | undefined} reference to the Module Nav parent element
   */
  get parent(): IdsModuleNav | undefined {
    const parentEl = getClosest(this, 'ids-module-nav');
    if (parentEl) return (parentEl as IdsModuleNav);
    return undefined;
  }

  /**
   * Set the offset content
   * @param {boolean} val The offset value
   */
  set offsetContent(val) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.OFFSET_CONTENT, '');
      this.container?.classList.add('offset-content');
    } else {
      this.removeAttribute(attributes.OFFSET_CONTENT);
      this.container?.classList.remove('offset-content');
    }
  }

  /**
   * @returns {boolean} true if offset content
   */
  get offsetContent(): boolean {
    return this.hasAttribute(attributes.OFFSET_CONTENT);
  }

  /**
   * @readonly
   * @returns {IdsOverlay | undefined} mobile-only overlay that covers the content area
   */
  get overlay(): IdsOverlay | null {
    return this.container!.querySelector<IdsOverlay>('ids-overlay');
  }

  /**
   * Shows the module nav content overlay
   */
  showOverlay() {
    this.overlay!.style.setProperty('z-index', 'var(--ids-z-index-10)');
    this.overlay!.setAttribute(attributes.VISIBLE, 'true');
  }

  /**
   * Hides the module nav content overlay
   */
  async hideOverlay() {
    this.overlay!.removeAttribute(attributes.VISIBLE);
    await waitForTransitionEnd(this.overlay!.container!, 'background-color');
    this.overlay!.style.removeProperty('z-index');
  }
}
