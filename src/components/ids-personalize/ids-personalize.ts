import { adjustColor, contrastColor } from '../../utils/ids-color-utils/ids-color-utils';

/**
 * Handle Personalization colors (and personalization related things)
 */
class IdsPersonalization {
  /** Holds the personalization color */
  state = { color: '#fff' };

  /**
   * Set the primary color and update the UI
   * @param {string} value the primary color
   */
  set color(value: string) {
    this.state.color = value;
    this.#appendStyleSheet();
  }

  /**
   * Set the current primary color info
   * @returns {Record<string, string>} An array of related colors
   */
  get color(): string {
    return this.state.color;
  }

  /**
   * Calculate color progression based on a single color
   * @param {string} color the primary color
   * @returns {Record<string, string>} An array of related colors
   */
  colorProgression(color: string) {
    return {
      primary: color,
      primary10: adjustColor(color, 0.1),
      primary20: adjustColor(color, 0.3),
      primary40: adjustColor(color, 0.45),
      primary30: adjustColor(color, 0.55),
      primary50: adjustColor(color, 0.70),
      primary60: color,
      primary70: adjustColor(color, -0.20),
      primary80: adjustColor(color, -0.30),
      primary90: adjustColor(color, -0.40),
      primary100: adjustColor(color, -0.55),
      contrast: contrastColor(color, '#f5f5f5', '#161618')
    };
  }

  /** Append a stylesheet for the color change */
  #appendStyleSheet() {
    const colors = this.colorProgression(this.state.color);
    const themeStyles = `:root, :host {
      --ids-color-primary: ${colors.primary};
      --ids-color-primary-10: ${colors.primary10};
      --ids-color-primary-20: ${colors.primary20};
      --ids-color-primary-30: ${colors.primary30};
      --ids-color-primary-40: ${colors.primary40};
      --ids-color-primary-50: ${colors.primary50};
      --ids-color-primary-60: ${colors.primary};
      --ids-color-primary-70: ${colors.primary70};
      --ids-color-primary-80: ${colors.primary80};
      --ids-color-primary-90: ${colors.primary90};
      --ids-color-primary-100: ${colors.primary100};
      --ids-header-input-color-border-hover: transparent;
      --ids-header-color-background:  var(--ids-color-primary);
      --ids-header-color-border-bottom:  var(--ids-color-primary-80);
      --ids-header-color-text: ${colors.contrast};
      --ids-header-button-color-text-default: ${adjustColor(colors.contrast, 0.9)};
      --ids-header-button-color-background-hover: rgba(0, 0, 0, .3);
      --ids-header-button-color-border-hover: rgba(0, 0, 0, .3);
      --ids-header-button-color-text-hover: ${colors.contrast};
      --ids-header-button-color-text-disabled: ${adjustColor(colors.contrast, 0.45)};
      --ids-header-button-color-text-pressed: ${colors.contrast};
      --ids-button-tertiary-color-background-pressed: ${colors.primary80};
      --ids-button-tertiary-color-border-pressed: ${colors.primary80};
      --ids-button-primary-color-background-default:  var(--ids-color-primary);
      --ids-button-primary-color-border-default:  var(--ids-color-primary);
      --ids-button-primary-color-background-hover: var(--ids-color-primary-80);
      --ids-button-primary-color-border-hover: var(--ids-color-primary-80);
      --ids-button-primary-color-background-disabled: var(--ids-color-primary);
      --ids-button-primary-color-border-disabled:  var(--ids-color-primary);
      --ids-button-primary-color-border-focus: var(--ids-color-primary);
      --ids-button-primary-shadow-focus: 0 0 0 2px var(--ids-color-background-default), 0 0 0 3px var(--ids-color-primary-80);
      --ids-button-secondary-color-border-default: var(--ids-color-primary);
      --ids-button-secondary-color-text-default: var(--ids-color-primary);
      --ids-button-secondary-color-border-disabled: var(--ids-color-primary);
      --ids-button-secondary-color-text-disabled: var(--ids-color-primary);
      --ids-button-secondary-color-background-hover: var(--ids-color-primary-10);
      --ids-button-secondary-color-border-hover: var(--ids-color-primary-70);
      --ids-button-secondary-color-text-hover: var(--ids-color-primary-70);
      --ids-button-secondary-shadow-focus: 0 0 0 2px var(--ids-color-background-default), 0 0 0 3px var(--ids-color-primary-80);
      --ids-button-secondary-color-border-focus: var(--ids-color-primary-80);
      --ids-button-tertiary-shadow-focus: 0 0 0 2px var(--ids-color-background-default), 0 0 0 3px var(--ids-color-primary-80);
      --ids-button-tertiary-color-border-focus: var(--ids-color-primary-80);
      --ids-checkbox-color-background-selected: var(--ids-color-primary);
      --ids-checkbox-color-border-selected: var(--ids-color-primary);
      --ids-checkbox-color-border-focus: var(--ids-color-primary);
      --ids-checkbox-shadow-focus: 0 0 0 2px var(--ids-color-background-default), 0 0 0 3px var(--ids-color-primary-80);
      --ids-input-color-border-focus: var(--ids-color-primary);
      --ids-shadow-focus: 0px 0px 6px 0px ${adjustColor(colors.primary, 0.4)};
      --ids-hyperlink-color-text-default: var(--ids-color-primary);
      --ids-hyperlink-color-text-hover: var(--ids-color-primary-80);
      --ids-progress-bar-fill-color-background: var(--ids-color-primary);
      --ids-tab-color-text-selected: var(--ids-color-primary);
      --ids-tab-color-text-selected: var(--ids-color-primary);
    }`;

    const doc = (document.head as any);
    const styleElem = document.querySelector('#ids-personalization');
    const style = styleElem || document.createElement('style');
    style.textContent = themeStyles;
    style.id = 'ids-personalization';
    style.setAttribute('nonce', (document as any).nonce);
    if (!styleElem) doc.appendChild(style);
  }
}

export default IdsPersonalization;
