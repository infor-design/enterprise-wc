/**
 * IDS Global Functions / Instances / And Utils Exposed to the end user.
 */
import { IdsDeferred } from '../../utils/ids-deferred-utils/ids-deferred-utils';
import IdsLocale from '../ids-locale/ids-locale';

declare global {
  interface Window {
    IdsGlobal: {
      locale?: IdsLocale;
      themeLoaded?: IdsDeferred;
      customIconData?: object;
    }
  }
}

window.IdsGlobal ??= {};

class IdsGlobal {
  /**
   *  Used to hold the single Locale instance
   * @returns {IdsLocale} the locale object
   */
  static getLocale(): IdsLocale {
    if (!window.IdsGlobal.locale) {
      window.IdsGlobal.locale = new IdsLocale();
    }
    return window.IdsGlobal.locale;
  }

  /**
   *  Used for a global theme event
   * @returns {IdsDeferred} the deferred object
   */
  static onThemeLoaded(): IdsDeferred {
    if (!window.IdsGlobal.themeLoaded) {
      window.IdsGlobal.themeLoaded = new IdsDeferred();
    }

    return window.IdsGlobal.themeLoaded;
  }

  /** Used to hold custom icon json */
  static set customIconData(json: object | undefined) {
    window.IdsGlobal.customIconData = json;
  }

  static get customIconData(): object | undefined {
    return window.IdsGlobal.customIconData;
  }
}

export default IdsGlobal;
