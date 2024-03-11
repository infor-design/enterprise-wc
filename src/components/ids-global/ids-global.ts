/* eslint-disable @typescript-eslint/ban-types */
/**
 * IDS Global Functions / Instances / And Utils Exposed to the end user.
 */
import { IdsDeferred } from '../../utils/ids-deferred-utils/ids-deferred-utils';
import { version } from '../../core/ids-attributes';
import IdsLocale from '../ids-locale/ids-locale';
import IdsPersonalize from '../ids-personalize/ids-personalize';

declare global {
  interface Window {
    IdsGlobal: {
      locale?: IdsLocale;
      themeLoaded?: IdsDeferred;
      themeName?: string;
      version?: string;
      personalize?: IdsPersonalize;
      customIconData?: object;
    }
  }
}

window.IdsGlobal ??= {
  version,
  personalize: new IdsPersonalize(),
  themeName: ''
};

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

  static get personalize(): IdsPersonalize {
    return IdsGlobal.personalize;
  }

  static get version(): string {
    return IdsGlobal.version;
  }

  static get themeName(): string {
    return window.IdsGlobal.themeName || '';
  }

  static set themeName(value: string) {
    window.IdsGlobal.themeName = value;
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
