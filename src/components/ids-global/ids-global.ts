/**
 * IDS Global Functions / Instances / And Utils Exposed to the end user.
 */
import IdsLocale from '../ids-locale/ids-locale';

declare global {
  interface Window {
    IdsGlobal: {
      locale?: IdsLocale
    }
  }
}

window.IdsGlobal = {};

class IdsGlobal {
  static getLocale(): IdsLocale {
    if (!window.IdsGlobal.locale) {
      window.IdsGlobal.locale = new IdsLocale();
    }

    return window.IdsGlobal.locale;
  }
}

export default IdsGlobal;
