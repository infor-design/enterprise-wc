import { customElement, scss } from '../../core/ids-decorators';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import IdsElement from '../../core/ids-element';

import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';

import styles from './ids-module-nav.scss';

import type IdsContainer from '../ids-container/ids-container';
import type IdsModuleNavBar from './ids-module-nav-bar';
import type IdsModuleNavContent from './ids-module-nav-content';

const Base = IdsModuleNavDisplayModeMixin(
  IdsElement
);

/**
 * IDS Module Nav Bar Component
 * @type {IdsModuleNavBar}
 * @inherits IdsDrawer
 */
@customElement('ids-module-nav')
@scss(styles)
export default class IdsModuleNav extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...super.attributes
    ];
  }

  // Slots:
  // - Role Switcher (IdsModuleNavSwitcher)
  // - Search (IdsSearchField)
  // - Main (IdsAccordionSection)
  // - Footer (IdsAccordionSection)
  // - Settings (IdsModuleNavSettings)
  // - Detail (any)
  template() {
    return `<div class="ids-module-nav">
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsModuleNavBar | undefined} reference to the Module Nav bar
   */
  get bar() {
    const barEl = this.querySelector('ids-module-nav-bar');
    if (barEl?.tagName === 'IDS-MODULE-NAV-BAR') {
      return (barEl as IdsModuleNavBar);
    }
    return undefined;
  }

  /**
   * @readonly
   * @returns {IdsModuleNavContent | undefined} reference to the content pane
   */
  get content() {
    const contentEl = this.querySelector('ids-module-nav-content');
    if (contentEl?.tagName === 'IDS-MODULE-NAV-CONTENT') {
      return (contentEl as IdsModuleNavContent);
    }
    return undefined;
  }

  /**
   * @readonly
   * @returns {IdsContainer | undefined} reference to the Module Nav parent element
   */
  get parent() {
    const parentEl: IdsContainer | undefined = getClosest(this, 'ids-container');
    if (parentEl) return parentEl;
    return undefined;
  }

  /**
   * Inherited from IdsModuleNavDisplayModeMixin
   */
  onDisplayModeChange(): void {
    if (this.bar) this.bar.displayMode = this.displayMode;
    if (this.content) this.content.displayMode = this.displayMode;
  }
}
