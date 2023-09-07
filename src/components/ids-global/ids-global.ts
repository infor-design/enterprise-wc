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
    }
  }
}

window.IdsGlobal ??= {};

class IdsGlobal {
  static getLocale(): IdsLocale {
    if (!window.IdsGlobal.locale) {
      window.IdsGlobal.locale = new IdsLocale();
    }
    return window.IdsGlobal.locale;
  }

  static getOnThemeLoaded(): IdsDeferred {
    if (!window.IdsGlobal.themeLoaded) {
      window.IdsGlobal.themeLoaded = new IdsDeferred();
    }

    return window.IdsGlobal.themeLoaded;
  }
}

export default IdsGlobal;
