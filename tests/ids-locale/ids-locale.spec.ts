import percySnapshot from '@percy/playwright';
import { Page, expect } from '@playwright/test';
import { test } from '../base-fixture';

import afMessages from '../../src/components/ids-locale/data/af-messages.json';
import arMessages from '../../src/components/ids-locale/data/ar-messages.json';
import bgMessages from '../../src/components/ids-locale/data/bg-messages.json';
import csMessages from '../../src/components/ids-locale/data/cs-messages.json';
import daMessages from '../../src/components/ids-locale/data/da-messages.json';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';
import elMessages from '../../src/components/ids-locale/data/el-messages.json';
import esMessages from '../../src/components/ids-locale/data/es-messages.json';
import etMessages from '../../src/components/ids-locale/data/et-messages.json';
import fiMessages from '../../src/components/ids-locale/data/fi-messages.json';
import frCAMessages from '../../src/components/ids-locale/data/fr-CA-messages.json';
import frFRMessages from '../../src/components/ids-locale/data/fr-FR-messages.json';
import frMessages from '../../src/components/ids-locale/data/fr-messages.json';
import heMessages from '../../src/components/ids-locale/data/he-messages.json';
import hiMessages from '../../src/components/ids-locale/data/hi-messages.json';
import hrMessages from '../../src/components/ids-locale/data/hr-messages.json';
import huMessages from '../../src/components/ids-locale/data/hu-messages.json';
import idMessages from '../../src/components/ids-locale/data/id-messages.json';
import itMessages from '../../src/components/ids-locale/data/it-messages.json';
import jaMessages from '../../src/components/ids-locale/data/ja-messages.json';
import koMessages from '../../src/components/ids-locale/data/ko-messages.json';
import ltMessages from '../../src/components/ids-locale/data/lt-messages.json';
import lvMessages from '../../src/components/ids-locale/data/lv-messages.json';
import msMessages from '../../src/components/ids-locale/data/ms-messages.json';
import nbMessages from '../../src/components/ids-locale/data/nb-messages.json';
import nlMessages from '../../src/components/ids-locale/data/nl-messages.json';
import nnMessages from '../../src/components/ids-locale/data/nn-messages.json';
import noMessages from '../../src/components/ids-locale/data/no-messages.json';
import plMessages from '../../src/components/ids-locale/data/pl-messages.json';
import ptBRMessages from '../../src/components/ids-locale/data/pt-BR-messages.json';
import ptPTMessages from '../../src/components/ids-locale/data/pt-PT-messages.json';
import ptMessages from '../../src/components/ids-locale/data/pt-messages.json';
import roMessages from '../../src/components/ids-locale/data/ro-messages.json';
import ruMessages from '../../src/components/ids-locale/data/ru-messages.json';
import skMessages from '../../src/components/ids-locale/data/sk-messages.json';
import slMessages from '../../src/components/ids-locale/data/sl-messages.json';
import svMessages from '../../src/components/ids-locale/data/sv-messages.json';
import thMessages from '../../src/components/ids-locale/data/th-messages.json';
import tlMessages from '../../src/components/ids-locale/data/tl-messages.json';
import trMessages from '../../src/components/ids-locale/data/tr-messages.json';
import ukMessages from '../../src/components/ids-locale/data/uk-messages.json';
import viMessages from '../../src/components/ids-locale/data/vi-messages.json';
import zhCNMessages from '../../src/components/ids-locale/data/zh-CN-messages.json';
import zhHansMessages from '../../src/components/ids-locale/data/zh-Hans-messages.json';
import zhHantMessages from '../../src/components/ids-locale/data/zh-Hant-messages.json';
import zhTWMessages from '../../src/components/ids-locale/data/zh-TW-messages.json';
import zhMessages from '../../src/components/ids-locale/data/zh-messages.json';

import afZALocale from '../../src/components/ids-locale/data/af-ZA.json';
import arEGLocale from '../../src/components/ids-locale/data/ar-EG.json';
import arSALocale from '../../src/components/ids-locale/data/ar-SA.json';
import bgBGLocale from '../../src/components/ids-locale/data/bg-BG.json';
import csCZLocale from '../../src/components/ids-locale/data/cs-CZ.json';
import daDKLocale from '../../src/components/ids-locale/data/da-DK.json';
import deDELocale from '../../src/components/ids-locale/data/de-DE.json';
import elGRLocale from '../../src/components/ids-locale/data/el-GR.json';
import enAULocale from '../../src/components/ids-locale/data/en-AU.json';
import enGBLocale from '../../src/components/ids-locale/data/en-GB.json';
import enINLocale from '../../src/components/ids-locale/data/en-IN.json';
import enNZLocale from '../../src/components/ids-locale/data/en-NZ.json';
import enZALocale from '../../src/components/ids-locale/data/en-ZA.json';
import es419Locale from '../../src/components/ids-locale/data/es-419.json';
import esARLocale from '../../src/components/ids-locale/data/es-AR.json';
import esESLocale from '../../src/components/ids-locale/data/es-ES.json';
import esMXLocale from '../../src/components/ids-locale/data/es-MX.json';
import esUSLocale from '../../src/components/ids-locale/data/es-US.json';
import etEELocale from '../../src/components/ids-locale/data/et-EE.json';
import fiFILocale from '../../src/components/ids-locale/data/fi-FI.json';
import frCALocale from '../../src/components/ids-locale/data/fr-CA.json';
import frFRLocale from '../../src/components/ids-locale/data/fr-FR.json';
import heILLocale from '../../src/components/ids-locale/data/he-IL.json';
import hiINLocale from '../../src/components/ids-locale/data/hi-IN.json';
import hrHRLocale from '../../src/components/ids-locale/data/hr-HR.json';
import huHULocale from '../../src/components/ids-locale/data/hu-HU.json';
import idIDLocale from '../../src/components/ids-locale/data/id-ID.json';
import itITLocale from '../../src/components/ids-locale/data/it-IT.json';
import jaJPLocale from '../../src/components/ids-locale/data/ja-JP.json';
import koKRLocale from '../../src/components/ids-locale/data/ko-KR.json';
import ltLTLocale from '../../src/components/ids-locale/data/lt-LT.json';
import lvLVLocale from '../../src/components/ids-locale/data/lv-LV.json';
import msnbLocale from '../../src/components/ids-locale/data/ms-bn.json';
import msmyLocale from '../../src/components/ids-locale/data/ms-my.json';
import nbNOLocale from '../../src/components/ids-locale/data/nb-NO.json';
import nlNLLocale from '../../src/components/ids-locale/data/nl-NL.json';
import nnNOLocale from '../../src/components/ids-locale/data/nn-NO.json';
import noNOLocale from '../../src/components/ids-locale/data/no-NO.json';
import plPLLocale from '../../src/components/ids-locale/data/pl-PL.json';
import ptBRLocale from '../../src/components/ids-locale/data/pt-BR.json';
import ptPRLocale from '../../src/components/ids-locale/data/pt-PT.json';
import roROLocale from '../../src/components/ids-locale/data/ro-RO.json';
import ruRULocale from '../../src/components/ids-locale/data/ru-RU.json';
import skSKLocale from '../../src/components/ids-locale/data/sk-SK.json';
import slSILocale from '../../src/components/ids-locale/data/sl-SI.json';
import svSELocale from '../../src/components/ids-locale/data/sv-SE.json';
import thTHLocale from '../../src/components/ids-locale/data/th-TH.json';
import tlPHLocale from '../../src/components/ids-locale/data/tl-PH.json';
import trTRLocale from '../../src/components/ids-locale/data/tr-TR.json';
import ukUALocale from '../../src/components/ids-locale/data/uk-UA.json';
import viVNLocale from '../../src/components/ids-locale/data/vi-VN.json';
import zhCNLocale from '../../src/components/ids-locale/data/zh-CN.json';
import zhHansLocale from '../../src/components/ids-locale/data/zh-Hans.json';
import zhHantLocale from '../../src/components/ids-locale/data/zh-Hant.json';
import zhTWLocale from '../../src/components/ids-locale/data/zh-TW.json';

test.describe('IdsLocale tests', () => {
  const url = '/ids-demo-app/utils.html';

  // eslint-disable-next-line jsdoc/require-jsdoc
  async function runLocaleFunction(page: Page, functionName: string, value: any, value2?: any, value3?: any) {
    if (functionName === 'twoDigitYearCutoff') {
      await page.evaluate((obj: any) => {
        ((window as any).utils as any).locale.twoDigitYearCutoff = obj.value;
      }, { value });
      return;
    }

    const setters = ['loadedLanguages', 'loadedLocales'];
    if (setters.find((item) => item === functionName)) {
      await page.evaluate((obj) => {
        ((window as any).utils as any).locale[obj.utilName].set(obj.key, obj.value);
      }, { utilName: functionName, key: value, value: value2 });
      return;
    }

    if (value3) {
      // eslint-disable-next-line max-len
      const returnValue = await page.evaluate((obj) => ((window as any).utils as any).locale[obj.utilName](obj.value, obj.value2, obj.value3), {
        utilName: functionName, value, value2, value3
      });
      return returnValue;
    }

    if (value2) {
      // eslint-disable-next-line max-len
      const returnValue = await page.evaluate((obj) => ((window as any).utils as any).locale[obj.utilName](obj.value, obj.value2), { utilName: functionName, value, value2 });
      return returnValue;
    }

    // eslint-disable-next-line max-len
    const returnValue = await page.evaluate((obj) => {
      const locale = ((window as any).utils as any).locale;
      if (typeof locale[obj.utilName] !== 'function') {
        locale[obj.utilName] = obj.value;
        return locale[obj.utilName];
      }
      return locale[obj.utilName]((obj.value));
    }, { utilName: functionName, value });
    return returnValue;
  }

  /**
   * Returns the value of the locale object from the browser
   *
   * **USAGE**
   * ```js
   * await getLocaleValues(page, 'locale') // returns the properties of locale
   * await getLocaleValues(page, 'locale.calendars[0]') // returns the properties of the first calendar object
   * await getLocaleValues(page, 'locale.calendars[0].dayPeriods') // inner object of an array
   * ```
   * @param {Page} page Page object from Playwright
   * @param {string} objectPath deeper property path starting after `window.utils.locale`
   * @returns {Promise<any>} window.utils.locale object or sub properties
   */
  const getLocaleValues = async (page: Page, objectPath?: string): Promise<any> => {
    const result = await page.evaluate((path) => {
      const base = ((window as any).utils as any).locale;
      if (!path) return base;
      const paths = path.split('.').filter((item) => item);
      let currentPath = base;
      for (let i = 0; i < paths.length; i++) {
        const arrHandle = paths[i].split('[');
        let refPath;
        if (arrHandle.length === 1) {
          refPath = currentPath[arrHandle[0]];
        } else if (arrHandle.length === 2) {
          refPath = currentPath[arrHandle[0]][parseInt(arrHandle[1].replaceAll(']', ''))];
        }
        if (refPath !== undefined) {
          if (refPath instanceof Map) refPath = Array.from(refPath).map(([name, value]) => ({ name, value }));
          currentPath = refPath;
        } else {
          return undefined;
        }
      }
      return currentPath;
    }, objectPath);
    return result;
  };

  test.beforeEach(async ({ page, pageErrorsTest }) => {
    await page.goto(url);
    pageErrorsTest.clearErrors();
  });

  test.afterEach(async ({ pageErrorsTest }) => {
    expect(pageErrorsTest.hasErrors()).toBeFalsy();
  });

  test.describe('two digit year checks', () => {
    test('should have a title', async ({ page }) => {
      await page.goto('/ids-locale/two-digit-year.html');
      await percySnapshot(page, 'ids-locale-two-digit-year-light');
    });

    test('should correct two digit year', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'en-US');
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '40')).toEqual(1940);
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '20')).toEqual(2020);
    });

    test('should correct three digit year', async ({ page }) => {
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '940')).toEqual(1940);
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '020')).toEqual(2020);
    });

    test('should be able to change two digit year cut off', async ({ page }) => {
      await runLocaleFunction(page, 'twoDigitYearCutoff', '75');

      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '74')).toEqual(2074);
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '77')).toEqual(1977);
    });
  });

  test.describe('functionality tests', () => {
    const validateDefault = async (page: Page) => {
      expect((await getLocaleValues(page)).name).toEqual('en-US');
      expect((await getLocaleValues(page, 'locale.options.englishName'))).toEqual('English (United States)');
      expect(Object.keys(await getLocaleValues(page, 'language.messages')).length).toBeGreaterThan(1);
      expect((await getLocaleValues(page, 'language.name'))).toEqual('en');
      expect((await getLocaleValues(page, 'locale.options.calendars[0].dateFormat.short'))).toEqual('M/d/yyyy');
    };

    test('can set locale', async ({ page }) => {
      await validateDefault(page);
      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await getLocaleValues(page)).name).toEqual('de-DE');
      expect((await getLocaleValues(page, 'locale.options.englishName'))).toEqual('German (Germany)');
      expect(Object.keys(await getLocaleValues(page, 'language.messages')).length).toBeGreaterThan(1);
      expect((await getLocaleValues(page, 'language.name'))).toEqual('de');
      expect((await getLocaleValues(page, 'locale.options.calendars[0].dateFormat.short'))).toEqual('dd.MM.yyyy');
    });

    test('can set locale with a setter', async ({ page }) => {
      await validateDefault(page);
      await runLocaleFunction(page, 'loadedLanguages', 'de', deMessages);
      await runLocaleFunction(page, 'loadedLocales', 'de-DE', deDELocale);
      await runLocaleFunction(page, 'locale', 'de-DE');
      expect((await getLocaleValues(page)).name).toEqual('de-DE');
      await runLocaleFunction(page, 'locale', '');
      expect((await getLocaleValues(page)).name).toEqual('de-DE');
    });

    test('can handle null/undefined locale', async ({ page }) => {
      await validateDefault(page);
      await runLocaleFunction(page, 'setLocale', null);
      expect((await getLocaleValues(page)).name).toEqual('en-US');
      await runLocaleFunction(page, 'setLocale', undefined);
      expect((await getLocaleValues(page)).name).toEqual('en-US');
      await runLocaleFunction(page, 'setLocale', '');
      expect((await getLocaleValues(page)).name).toEqual('en-US');
    });

    test('can load all languages', async ({ page }) => {
      await runLocaleFunction(page, 'loadedLanguages', 'ar', arMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'bg', bgMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'af', afMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'cs', csMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'da', daMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'de', deMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'el', elMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'es', esMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'et', etMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'fi', fiMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'fr-CA', frCAMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'fr-FR', frFRMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'fr', frMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'he', heMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'hi', hiMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'hr', hrMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'hu', huMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'id', idMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'it', itMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'ja', jaMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'ko', koMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'lt', ltMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'lv', lvMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'ms', msMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'nb', nbMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'nl', nlMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'nn', nnMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'no', noMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'pl', plMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'pt-BR', ptBRMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'pt-PT', ptPTMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'pt', ptMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'ro', roMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'ru', ruMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'sk', skMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'sl', slMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'sv', svMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'th', thMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'tl', tlMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'tr', trMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'uk', ukMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'vi', viMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'zh-CN', zhCNMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'zh-Hans', zhHansMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'zh-Hant', zhHantMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'zh-TW', zhTWMessages);
      await runLocaleFunction(page, 'loadedLanguages', 'zh', zhMessages);

      expect((await getLocaleValues(page, 'loadedLanguages'))).toHaveLength(48);
    });

    test('can load all locales', async ({ page }) => {
      await runLocaleFunction(page, 'loadedLocales', 'af-ZA', afZALocale);
      await runLocaleFunction(page, 'loadedLocales', 'ar-EG', arEGLocale);
      await runLocaleFunction(page, 'loadedLocales', 'ar-SA', arSALocale);
      await runLocaleFunction(page, 'loadedLocales', 'bg-BG', bgBGLocale);
      await runLocaleFunction(page, 'loadedLocales', 'cs-CZ', csCZLocale);
      await runLocaleFunction(page, 'loadedLocales', 'da-DK', daDKLocale);
      await runLocaleFunction(page, 'loadedLocales', 'de-DE', deDELocale);
      await runLocaleFunction(page, 'loadedLocales', 'el-GR', elGRLocale);
      await runLocaleFunction(page, 'loadedLocales', 'en-AU', enAULocale);
      await runLocaleFunction(page, 'loadedLocales', 'en-GB', enGBLocale);
      await runLocaleFunction(page, 'loadedLocales', 'en-IN', enINLocale);
      await runLocaleFunction(page, 'loadedLocales', 'en-NZ', enNZLocale);
      await runLocaleFunction(page, 'loadedLocales', 'en-ZA', enZALocale);
      await runLocaleFunction(page, 'loadedLocales', 'es-419', es419Locale);
      await runLocaleFunction(page, 'loadedLocales', 'es-AR', esARLocale);
      await runLocaleFunction(page, 'loadedLocales', 'es-ES', esESLocale);
      await runLocaleFunction(page, 'loadedLocales', 'es-MX', esMXLocale);
      await runLocaleFunction(page, 'loadedLocales', 'es-US', esUSLocale);
      await runLocaleFunction(page, 'loadedLocales', 'et-EE', etEELocale);
      await runLocaleFunction(page, 'loadedLocales', 'fi-FI', fiFILocale);
      await runLocaleFunction(page, 'loadedLocales', 'fr-CA', frCALocale);
      await runLocaleFunction(page, 'loadedLocales', 'fr-FR', frFRLocale);
      await runLocaleFunction(page, 'loadedLocales', 'he-IL', heILLocale);
      await runLocaleFunction(page, 'loadedLocales', 'hi-IN', hiINLocale);
      await runLocaleFunction(page, 'loadedLocales', 'hr-HR', hrHRLocale);
      await runLocaleFunction(page, 'loadedLocales', 'hu-HU', huHULocale);
      await runLocaleFunction(page, 'loadedLocales', 'id-ID', idIDLocale);
      await runLocaleFunction(page, 'loadedLocales', 'it-IT', itITLocale);
      await runLocaleFunction(page, 'loadedLocales', 'ja-JP', jaJPLocale);
      await runLocaleFunction(page, 'loadedLocales', 'ko-KR', koKRLocale);
      await runLocaleFunction(page, 'loadedLocales', 'lt-LT', ltLTLocale);
      await runLocaleFunction(page, 'loadedLocales', 'lv-LV', lvLVLocale);
      await runLocaleFunction(page, 'loadedLocales', 'ms-bn', msnbLocale);
      await runLocaleFunction(page, 'loadedLocales', 'ms-my', msmyLocale);
      await runLocaleFunction(page, 'loadedLocales', 'nb-NO', nbNOLocale);
      await runLocaleFunction(page, 'loadedLocales', 'nl-NL', nlNLLocale);
      await runLocaleFunction(page, 'loadedLocales', 'nn-NO', nnNOLocale);
      await runLocaleFunction(page, 'loadedLocales', 'no-NO', noNOLocale);
      await runLocaleFunction(page, 'loadedLocales', 'pl-PL', plPLLocale);
      await runLocaleFunction(page, 'loadedLocales', 'pt-BR', ptBRLocale);
      await runLocaleFunction(page, 'loadedLocales', 'pt-PT', ptPRLocale);
      await runLocaleFunction(page, 'loadedLocales', 'ro-RO', roROLocale);
      await runLocaleFunction(page, 'loadedLocales', 'ru-RU', ruRULocale);
      await runLocaleFunction(page, 'loadedLocales', 'sk-SK', skSKLocale);
      await runLocaleFunction(page, 'loadedLocales', 'sl-SI', slSILocale);
      await runLocaleFunction(page, 'loadedLocales', 'sv-SE', svSELocale);
      await runLocaleFunction(page, 'loadedLocales', 'th-TH', thTHLocale);
      await runLocaleFunction(page, 'loadedLocales', 'tl-PH', tlPHLocale);
      await runLocaleFunction(page, 'loadedLocales', 'tr-TR', trTRLocale);
      await runLocaleFunction(page, 'loadedLocales', 'uk-UA', ukUALocale);
      await runLocaleFunction(page, 'loadedLocales', 'vi-VN', viVNLocale);
      await runLocaleFunction(page, 'loadedLocales', 'zh-CN', zhCNLocale);
      await runLocaleFunction(page, 'loadedLocales', 'zh-Hans', zhHansLocale);
      await runLocaleFunction(page, 'loadedLocales', 'zh-Hant', zhHantLocale);
      await runLocaleFunction(page, 'loadedLocales', 'zh-TW', zhTWLocale);

      expect((await getLocaleValues(page, 'loadedLocales'))).toHaveLength(56);
    });

    test('can set language to nb', async ({ page }) => {
      await validateDefault(page);

      await runLocaleFunction(page, 'setLanguage', 'nb');
      expect(await runLocaleFunction(page, 'translate', 'Actions')).toEqual('Handlinger');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('nb');
    });

    test('can set language to nn', async ({ page }) => {
      await validateDefault(page);

      await runLocaleFunction(page, 'setLanguage', 'nn');
      expect(await runLocaleFunction(page, 'translate', 'Actions')).toEqual('Handlinger');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('nn');
    });

    // Old test loads all languages/locales before each test
    // Failing due to not being translated to German
    test.skip('can show in current language when language is not loaded', async ({ page }) => {
      await validateDefault(page);

      await runLocaleFunction(page, 'setLanguage', 'fi');
      expect(await runLocaleFunction(page, 'translate', 'Actions')).toEqual('Toiminnot');
      expect(await runLocaleFunction(page, 'translate', 'Actions', { language: 'de' })).toEqual('Aktionen');
    });

    test('can set locale correctly', async ({ page }) => {
      expect((await getLocaleValues(page))).toBeTruthy();
    });

    test('can set language with a setter', async ({ page }) => {
      await validateDefault(page);

      await runLocaleFunction(page, 'language', 'no');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('no');
    });

    test('can set in and iw languages', async ({ page }) => {
      await validateDefault(page);

      await runLocaleFunction(page, 'setLanguage', 'in-ID');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('id');

      await runLocaleFunction(page, 'setLanguage', 'iw');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('he');
    });

    test('can set in and iw locales', async ({ page }) => {
      await validateDefault(page);

      await runLocaleFunction(page, 'setLocale', 'in-ID');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('id-ID');

      await runLocaleFunction(page, 'setLocale', 'iw');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('he-IL');
    });

    test('can contain time data', async ({ page }) => {
      const testData = [
        {
          data: 'af-ZA', timeFormat: 'HH:mm', timestamp: 'HH:mm:ss', datetime: 'yyyy-MM-dd HH:mm'
        },
        {
          data: 'bg-BG', timeFormat: 'H:mm', timestamp: 'H:mm:ss', datetime: 'd.MM.yyyy H:mm'
        },
        {
          data: 'cs-CZ', timeFormat: 'H:mm', timestamp: 'H:mm:ss', datetime: 'dd.MM.yyyy H:mm'
        },
        {
          data: 'da-DK', timeFormat: 'HH.mm', timestamp: 'HH.mm.ss', datetime: 'dd-MM-yyyy HH.mm'
        },
        {
          data: 'fi-FI', timeFormat: 'H.mm', timestamp: 'H.mm.ss', datetime: 'd.M.yyyy H.mm'
        },
        {
          data: 'de-DE', timeFormat: 'HH:mm', timestamp: 'HH:mm:ss', datetime: 'dd.MM.yyyy HH:mm'
        },
        {
          data: 'el-GR', timeFormat: 'h:mm a', timestamp: 'h:mm:ss a', datetime: 'd/M/yyyy h:mm a'
        },
        {
          data: 'pl-PL', timeFormat: 'HH:mm', timestamp: 'HH:mm:ss', datetime: 'dd.MM.yyyy HH:mm'
        },
        {
          data: 'pt-BR', timeFormat: 'HH:mm', timestamp: 'HH:mm:ss', datetime: 'dd/MM/yyyy HH:mm'
        },
        {
          data: 'sl-SI', timeFormat: 'HH:mm', timestamp: 'HH:mm:ss', datetime: 'd. MM. yyyy HH:mm'
        },
      ];

      for (const data of testData) {
        await runLocaleFunction(page, 'setLocale', data.data);
        const calendar = await runLocaleFunction(page, 'calendar', '');
        expect(calendar.timeFormat).toEqual(data.timeFormat);
        expect(calendar.dateFormat.timestamp).toEqual(data.timestamp);
        expect(calendar.dateFormat.datetime).toEqual(data.datetime);
      }
    });

    test('can get calendar by name', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      await runLocaleFunction(page, 'setLocale', 'de-DE');
      await runLocaleFunction(page, 'setLocale', 'en-US');
      let calendar = await runLocaleFunction(page, 'calendar', 'de-DE');
      expect(calendar.timeFormat).toEqual('HH:mm');
      expect(calendar.dateFormat.timestamp).toEqual('HH:mm:ss');
      expect(calendar.dateFormat.datetime).toEqual('dd.MM.yyyy HH:mm');
      calendar = await runLocaleFunction(page, 'calendar', 'ar-SA', 'gregorian');
      expect(calendar.dateFormat.datetime).toEqual('d/MM/yyyy h:mm a');
      calendar = await runLocaleFunction(page, 'calendar', 'ar-SA', 'islamic-umalqura');
      expect(calendar.dateFormat.datetime).toEqual('yyyy/MM/dd h:mm a');
    });
  });

  test.describe('translation tests', () => {
    test('can support translation', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'de-DE');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Erforderlich');
      expect(await runLocaleFunction(page, 'translate', 'Loading')).toEqual('Laden');
      expect(await runLocaleFunction(page, 'translate', 'Filter')).toEqual('Filtern');
      expect(await runLocaleFunction(page, 'translate', 'XYZ')).toEqual('[XYZ]');
      expect(await runLocaleFunction(page, 'translate', 'Equals')).toEqual('Gleich');

      await runLocaleFunction(page, 'setLanguage', 'af-ZA');
      expect(await runLocaleFunction(page, 'translate', 'XYZ')).toEqual('[XYZ]');
      expect(await runLocaleFunction(page, 'translate', 'Equals')).toEqual('Gelyk aan');
    });

    test('can get translation in non current locale (fi-FI)', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'de');
      await runLocaleFunction(page, 'setLanguage', 'fi');
      await runLocaleFunction(page, 'setLanguage', 'sv');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Obligatoriskt');
      expect(await runLocaleFunction(page, 'translate', 'Required', { language: 'de' })).toEqual('Erforderlich');
      expect(await runLocaleFunction(page, 'translate', 'Required', { language: 'sv' })).toEqual('Obligatoriskt');
    });

    test('can get translation in non current locale (de-DE)', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'de');
      await runLocaleFunction(page, 'setLocale', 'en-US');
      await runLocaleFunction(page, 'setLanguage', 'en');

      expect((await getLocaleValues(page, 'locale.name'))).toEqual('en-US');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('en');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Required');
      expect(await runLocaleFunction(page, 'translate', 'Loading')).toEqual('Loading');
      expect(await runLocaleFunction(page, 'translate', 'Required', { language: 'de' })).toEqual('Erforderlich');
      expect(await runLocaleFunction(page, 'translate', 'Loading', { language: 'de' })).toEqual('Laden');
    });

    test('can return undefined if translation is not found', async ({ page }) => {
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: true })).toEqual(undefined);
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: false })).toEqual('[XYZ]');
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: true })).toEqual(undefined);
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: false })).toEqual('[XYZ]');

      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: true, showBrackets: true })).toEqual(undefined);
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: false, showBrackets: true })).toEqual('[XYZ]');
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: true, showBrackets: false })).toEqual(undefined);
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showAsUndefined: false, showBrackets: false })).toEqual('XYZ');

      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showBrackets: true })).toEqual('[XYZ]');
      expect(await runLocaleFunction(page, 'translate', 'XYZ', { showBrackets: false })).toEqual('XYZ');
    });

    test('can set language to full code', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'en-US');
      await runLocaleFunction(page, 'setLanguage', 'fr-CA');

      expect((await getLocaleValues(page, 'locale.name'))).toEqual('en-US');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('fr-CA');
      expect(await runLocaleFunction(page, 'translate', 'AddComments')).toEqual('Ajouter des commentaires');
      expect(await runLocaleFunction(page, 'translate', 'ReorderRows')).toEqual('Réorganiser les lignes');
      expect(await runLocaleFunction(page, 'translate', 'SelectDay')).toEqual('Sélectionner un jour');
      expect(await runLocaleFunction(page, 'translate', 'UserProfile')).toEqual('Profil utilisateur');

      await runLocaleFunction(page, 'setLanguage', 'de-DE');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('en-US');
      expect(await runLocaleFunction(page, 'translate', 'AddComments')).toEqual('Anmerkungen hinzufügen');
      expect(await runLocaleFunction(page, 'translate', 'ReorderRows')).toEqual('Zeilen neu anordnen');
      expect(await runLocaleFunction(page, 'translate', 'SelectDay')).toEqual('Tag auswählen');
      expect(await runLocaleFunction(page, 'translate', 'UserProfile')).toEqual('Benutzerprofil');
    });

    test('can provide a different fr-CA and fr-FR', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'fr-FR');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('fr-FR');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('fr-FR');
      expect(await runLocaleFunction(page, 'translate', 'From')).toEqual('Début');

      await runLocaleFunction(page, 'setLocale', 'fr-CA');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('fr-CA');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('fr-CA');
      expect(await runLocaleFunction(page, 'translate', 'From')).toEqual('De');
    });

    test('can get the parent locale', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'es-MX');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('es-MX');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('es');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Obligatorio');

      await runLocaleFunction(page, 'setLocale', 'es-419');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('es-419');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('es');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Obligatorio');

      await runLocaleFunction(page, 'setLocale', 'nb-NO');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('nb-NO');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('nb');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Obligatorisk');

      await runLocaleFunction(page, 'setLocale', 'no-NO');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('no-NO');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('no');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Obligatorisk');
    });

    test('can set possible to add translations', async ({ page }) => {
      await page.evaluate(() => {
        ((window as any).utils as any).locale.language.messages.CustomValue = { id: 'CustomValue', value: 'Added Custom Value' };
      });

      expect(await runLocaleFunction(page, 'translate', 'CollapseAppTray')).toEqual('Collapse app tray');
      expect(await runLocaleFunction(page, 'translate', 'CustomValue')).toEqual('Added Custom Value');
    });

    test('can set language to full code from similar language', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'fr-FR');
      await runLocaleFunction(page, 'setLanguage', 'fr-CA');

      expect((await getLocaleValues(page, 'locale.name'))).toEqual('fr-FR');
      expect((await getLocaleValues(page, 'language.name'))).toEqual('fr-CA');

      expect(await runLocaleFunction(page, 'translate', 'AddComments')).toEqual('Ajouter des commentaires');
      expect(await runLocaleFunction(page, 'translate', 'ReorderRows')).toEqual('Réorganiser les lignes');
      expect(await runLocaleFunction(page, 'translate', 'SelectDay')).toEqual('Sélectionner un jour');
      expect(await runLocaleFunction(page, 'translate', 'UserProfile')).toEqual('Profil utilisateur');
    });

    test('can treat no-NO, nn-NO, and nb-NO as same locale', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'no');
      expect(await runLocaleFunction(page, 'translate', 'Loading')).toEqual('Laster');

      await runLocaleFunction(page, 'setLanguage', 'nb');
      expect(await runLocaleFunction(page, 'translate', 'Loading')).toEqual('Laster');

      await runLocaleFunction(page, 'setLanguage', 'nn');
      expect(await runLocaleFunction(page, 'translate', 'Loading')).toEqual('Laster');
    });

    test('can add translations', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'it');
      const myStrings = {
        Thanks: { id: 'Thanks', value: 'Grazie', comment: '' },
        YourWelcome: { id: 'YourWelcome', value: 'Prego', comment: '' }
      };

      await runLocaleFunction(page, 'extendTranslations', 'it', myStrings);
      expect(await runLocaleFunction(page, 'translate', 'Comments')).toEqual('Commenti');
      expect(await runLocaleFunction(page, 'translate', 'Thanks')).toEqual('Grazie');
      expect(await runLocaleFunction(page, 'translate', 'YourWelcome')).toEqual('Prego');
    });

    test('can prevent adding translation on non existent language', async ({ page }) => {
      const myStrings = {
        Thanks: { id: 'Thanks', value: 'Grazie', comment: '' }
      };

      await runLocaleFunction(page, 'extendTranslations', 'ff', myStrings);
      expect(await runLocaleFunction(page, 'translate', 'Thanks')).toEqual('[Thanks]');
    });

    test('can prevent translation of &nsbp;', async ({ page }) => {
      expect(await runLocaleFunction(page, 'translate', '&nsbp;')).toEqual('');
    });

    test('can correct missing languages to english', async ({ page }) => {
      const myStrings = {
        ExtraX: { id: 'ExtraX', value: 'ExtraX', comment: '' }
      };

      await runLocaleFunction(page, 'extendTranslations', 'en', myStrings);
      await runLocaleFunction(page, 'setLanguage', 'th-TH');
      expect(await runLocaleFunction(page, 'translate', 'ExtraX')).toEqual('ExtraX');
    });

    test('can correct placeholder for missing translations', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'th-TH');
      expect(await runLocaleFunction(page, 'translate', 'Locale')).toEqual('ตำแหน่งที่ตั้ง');

      await runLocaleFunction(page, 'setLanguage', 'fr-FR');
      expect(await runLocaleFunction(page, 'translate', 'SetTime')).toEqual('Définir l\'heure');

      await runLocaleFunction(page, 'setLanguage', 'fr-CA');
      expect(await runLocaleFunction(page, 'translate', 'SetTime')).toEqual('Définir l\'heure');

      await runLocaleFunction(page, 'setLanguage', 'el-GR');
      expect(await runLocaleFunction(page, 'translate', 'Blockquote')).toEqual('Αποκλεισμός προσφοράς');
      expect(await runLocaleFunction(page, 'translate', 'ViewSource')).toEqual('Προβολή πηγής');

      await runLocaleFunction(page, 'setLanguage', 'lt-LT');
      expect(await runLocaleFunction(page, 'translate', 'CssClass')).toEqual('Css klasė');

      await runLocaleFunction(page, 'setLanguage', 'zh-CN');
      expect(await runLocaleFunction(page, 'translate', 'StrikeThrough')).toEqual('删除线');
      expect(await runLocaleFunction(page, 'translate', 'InsertAnchor')).toEqual('插入定位标记');
    });

    test('can convert character chases in specific locales', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'tr-TR');
      const result = await page.evaluate(() => {
        const texts = {
          kodlari: 'kodları'.toLocaleUpperCase(),
          istanbul: 'İSTANBUL'.toLocaleLowerCase()
        };
        return texts;
      });
      expect(result.kodlari).toEqual('KODLARI');
      expect(result.istanbul).toEqual('i̇stanbul');
    });
  });

  test.describe('number formatting tests', () => {
    test('can get decimal format', async ({ page }) => {
      expect((await runLocaleFunction(page, 'numbers', '')).decimal).toEqual('.');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'numbers', '')).decimal).toEqual(',');
    });

    test('can convert arabic numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '١٢٣٤٥٦٧٨٩٠'))).toEqual(1234567890);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '١٢٣'))).toEqual(123);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '١٢٣.٤٥'))).toEqual(123.45);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '١٬٢٣٤٬٥٦٧٬٨٩٠'))).toEqual(1234567890);
    });

    test('can convert hebrew numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '१२३४५६७८९०'))).toEqual(1234567890);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '१२३'))).toEqual(123);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '१२३.४५'))).toEqual(123.45);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '१,२३४,५६७,८९०'))).toEqual(1234567890);
    });

    test('can convert chinese financial traditional numbers numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '壹貳叄肆伍陸柒捌玖零'))).toEqual(1234567890);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '貳零壹玖'))).toEqual(2019);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '壹貳叄.肆伍'))).toEqual(123.45);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '壹,貳叄肆,伍陸柒,捌玖零'))).toEqual(1234567890);
    });

    test('can convert chinese financial simplified numbers numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '壹贰叁肆伍陆柒捌玖零'))).toEqual(1234567890);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '贰零壹玖'))).toEqual(2019);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '壹贰叁.肆伍'))).toEqual(123.45);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '壹,贰叁肆,伍陆柒,捌玖零'))).toEqual(1234567890);
    });

    test('can convert chinese normal numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '一二三四五六七八九零'))).toEqual(1234567890);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '二零一九'))).toEqual(2019);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '二〇一九'))).toEqual(2019);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '一二三.四五'))).toEqual(123.45);
      expect((await runLocaleFunction(page, 'convertNumberToEnglish', '一,二三四,五六七,八九零'))).toEqual(1234567890);
    });

    test('can support unicode', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 2019, { locale: 'ar-SA' }))).toEqual('٢٬٠١٩٫٠٠');
      expect((await runLocaleFunction(page, 'formatNumber', 2019, { locale: 'zh-Hans-CN-u-nu-hanidec' }))).toEqual('二,〇一九.〇〇');
    });

    test('can handle exceptions', async ({ page }) => {
      // expect((await runLocaleFunction(page, 'formatNumber', 2019, { locale: 'timestamp' }))).toEqual('NaN');
      const result = await page.evaluate(() => {
        ((window as any).utils as any).locale.formatNumber(undefined, { date: 'timestamp' });
      });

      console.info(result);
    });
  });

  test('', async ({ page }) => {

  });
});
