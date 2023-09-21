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
      version?: string;
      personalize?: IdsPersonalize;
    }
  }
}

window.IdsGlobal ??= {
  version,
  personalize: new IdsPersonalize()
};

class IdsGlobal {
  static getLocale(): IdsLocale {
    if (!window.IdsGlobal.locale) {
      window.IdsGlobal.locale = new IdsLocale();
    }
    return window.IdsGlobal.locale;
  }

  static onThemeLoaded(): IdsDeferred {
    if (!window.IdsGlobal.themeLoaded) {
      window.IdsGlobal.themeLoaded = new IdsDeferred();
    }

    return window.IdsGlobal.themeLoaded;
  }

  static get personalize(): IdsPersonalize {
    return IdsGlobal.personalize;
  }

  static get version(): IdsPersonalize {
    return IdsGlobal.version;
  }
}

export default IdsGlobal;
