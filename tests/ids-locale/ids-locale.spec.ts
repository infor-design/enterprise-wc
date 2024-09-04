/* eslint-disable no-irregular-whitespace */
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

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('two digit year checks', () => {
    test('should match the visual snapshot in percy', async ({ page }) => {
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
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

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

    test('can set the html lang and dir attribute', async ({ page }) => {
      const container = await page.locator('ids-container');
      await page.goto('/ids-locale/example.html');
      await page.evaluate(async (message) => {
        const locale = ((window as any).IdsGlobal as any).locale;
        locale.loadedLanguages.set('de', message.de);
        locale.loadedLanguages.set('ar', message.ar);
        locale.setLanguage('de');
      }, { de: deMessages, ar: arMessages });
      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await expect(container).toHaveAttribute('language', 'de');
      await expect(container).not.toHaveAttribute('dir');

      await page.evaluate(async () => ((window as any).IdsGlobal as any).locale.setLanguage('ar'));
      await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
      await expect(container).toHaveAttribute('language', 'ar');
      await expect(container).toHaveAttribute('dir', 'rtl');

      await page.evaluate(async () => ((window as any).IdsGlobal as any).locale.setLanguage('de'));
      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await expect(container).toHaveAttribute('language', 'de');
      await expect(container).not.toHaveAttribute('dir');
    });
  });

  test.describe('translation tests', () => {
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can support translation', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'de-DE');
      await runLocaleFunction(page, 'setLanguage', 'de-DE');
      expect(await runLocaleFunction(page, 'translate', 'Required')).toEqual('Erforderlich');
      expect(await runLocaleFunction(page, 'translate', 'Loading')).toEqual('Laden');
      expect(await runLocaleFunction(page, 'translate', 'Filter')).toEqual('Filtern');
      expect(await runLocaleFunction(page, 'translate', 'XYZ')).toEqual('[XYZ]');
      expect(await runLocaleFunction(page, 'translate', 'Equals')).toEqual('Gleich');

      await runLocaleFunction(page, 'setLanguage', 'af-ZA');
      await runLocaleFunction(page, 'setLanguage', 'af-ZA');
      expect(await runLocaleFunction(page, 'translate', 'XYZ')).toEqual('[XYZ]');
      expect(await runLocaleFunction(page, 'translate', 'Equals')).toEqual('Gelyk aan');
    });

    test('can get translation in non current locale (fi-FI)', async ({ page }) => {
      await runLocaleFunction(page, 'setLanguage', 'de');
      await runLocaleFunction(page, 'setLanguage', 'fi');
      await runLocaleFunction(page, 'setLanguage', 'sv');
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
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

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
      expect(await page.evaluate(() => {
        const response = ((window as any).utils as any).locale.formatNumber('undefined', { date: 'timestamp' });
        return response;
      })).toEqual('NaN');
    });

    test('can format big numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', '123456789012.123456', {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }))).toEqual('123,456,789,012.123456');

      expect((await runLocaleFunction(page, 'formatNumber', parseFloat('123456789012.123456'), {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }))).toEqual('123,456,789,012.123460');

      expect((await runLocaleFunction(page, 'formatNumber', '-922589489099.38', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        group: '',
        decimal: '.'
      }))).toEqual('-922589489099.38');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', '12345678901222121.123456', {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }))).toEqual('12.345.678.901.222.121,123456');
    });

    test('can format integer numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', '123456', {
        style: 'integer'
      }))).toEqual('123,456');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', '123456', {
        style: 'integer'
      }))).toEqual('123.456');
    });

    test('can set min and max fraction digits', async ({ page }) => {
      const testData = [
        {
          data: '12345', min: 0, max: 2, expected: '12,345'
        },
        {
          data: '12345.1', min: 0, max: 2, expected: '12,345.1'
        },
        {
          data: '12345.12', min: 0, max: 2, expected: '12,345.12'
        },
        {
          data: '12345.123', min: 0, max: 2, expected: '12,345.12'
        },
        {
          data: '12345.1234', min: 0, max: 2, expected: '12,345.12'
        },
        {
          data: '12345', min: 2, max: 4, expected: '12,345.00'
        },
        {
          data: '12345.1', min: 2, max: 4, expected: '12,345.10'
        },
        {
          data: '12345.12', min: 2, max: 4, expected: '12,345.12'
        },
        {
          data: '12345.123', min: 2, max: 4, expected: '12,345.123'
        },
        {
          data: '12345.12345678', min: 2, max: 4, expected: '12,345.1235'
        }
      ];

      for (const data of testData) {
        expect((await runLocaleFunction(page, 'formatNumber', data.data, {
          minimumFractionDigits: data.min,
          maximumFractionDigits: data.max
        }))).toEqual(data.expected);
      }
    });

    test('can set only min fraction digits', async ({ page }) => {
      const testData = [
        {
          data: '12345', min: 2, expected: '12,345.00'
        },
        {
          data: '12345', min: 0, expected: '12,345'
        },
        {
          data: '12345.1', min: 0, expected: '12,345.1'
        },
        {
          data: '12345', min: 4, expected: '12,345.0000'
        },
        {
          data: '12345.1', min: 5, expected: '12,345.10000'
        }
      ];

      for (const data of testData) {
        expect((await runLocaleFunction(page, 'formatNumber', data.data, {
          minimumFractionDigits: data.min
        }))).toEqual(data.expected);
      }
    });

    test('can format negative numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', -1000000, {
        style: 'currency', currency: 'USD'
      }))).toEqual('-$1,000,000.00');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', -1000000, {
        style: 'currency', currency: 'EUR'
      }))).toEqual('-1.000.000,00 €');
    });

    test('can format big decimal numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 123.54, {
        minimumFractionDigits: 15,
        maximumFractionDigits: 15
      }))).toEqual('123.540000000000000');

      expect((await runLocaleFunction(page, 'formatNumber', 123.54, {
        minimumFractionDigits: 20,
        maximumFractionDigits: 20
      }))).toEqual('123.54000000000000000000');

      expect((await runLocaleFunction(page, 'formatNumber', 123, {
        minimumFractionDigits: 20,
        maximumFractionDigits: 20
      }))).toEqual('123.00000000000000000000');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', 123.54, {
        minimumFractionDigits: 15,
        maximumFractionDigits: 15
      }))).toEqual('123,540000000000000');

      expect((await runLocaleFunction(page, 'formatNumber', 123.54, {
        minimumFractionDigits: 20,
        maximumFractionDigits: 20
      }))).toEqual('123,54000000000000000000');

      expect((await runLocaleFunction(page, 'formatNumber', 123, {
        minimumFractionDigits: 20,
        maximumFractionDigits: 20
      }))).toEqual('123,00000000000000000000');
    });

    test('can format number in non current locale', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      await runLocaleFunction(page, 'setLocale', 'hi-IN');
      await runLocaleFunction(page, 'setLocale', 'en-US');

      expect((await getLocaleValues(page, 'language.name'))).toEqual('en');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234, { locale: 'en-US' }))).toEqual('123,456,789.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234))).toEqual('123,456,789.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234, { locale: 'nl-NL' }))).toEqual('123.456.789,123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234, { locale: 'en-US' }))).toEqual('123,456,789.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234))).toEqual('123,456,789.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234, { locale: 'hi-IN' }))).toEqual('12,34,56,789.123');
      expect((await getLocaleValues(page, 'locale.name'))).toEqual('en-US');
    });

    test('can format decimals in different locale and settings', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 145000))).toEqual('145,000.00');
      expect((await runLocaleFunction(page, 'formatNumber', 283423))).toEqual('283,423.00');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1234))).toEqual('12,345.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.123, { style: 'decimal', maximumFractionDigits: 2 }))).toEqual('12,345.12');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.123456, { style: 'decimal', maximumFractionDigits: 3 }))).toEqual('12,345.123');
      expect((await runLocaleFunction(page, 'formatNumber', 0.0000004, { style: 'decimal', maximumFractionDigits: 7 }))).toEqual('0.0000004');
      expect((await runLocaleFunction(page, 'formatNumber', 20.1, { style: 'decimal', round: true, minimumFractionDigits: 2 }))).toEqual('20.10');
      expect((await runLocaleFunction(page, 'formatNumber', 20.1, { style: 'decimal', round: true }))).toEqual('20.10');
      expect((await runLocaleFunction(page, 'formatNumber', '12,345.123'))).toEqual('12,345.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1234, { group: '' }))).toEqual('12345.123');
      expect((await runLocaleFunction(page, 'formatNumber', 5.1, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))).toEqual('5.10');
      expect((await runLocaleFunction(page, 'formatNumber', 145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 }))).toEqual('145,000.00000');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', 145000))).toEqual('145.000,00');
      expect((await runLocaleFunction(page, 'formatNumber', 283423))).toEqual('283.423,00');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1))).toEqual('12.345,10');
      expect((await runLocaleFunction(page, 'formatNumber', 0.0000004, { style: 'decimal', maximumFractionDigits: 7 }))).toEqual('0,0000004');
      expect((await runLocaleFunction(page, 'formatNumber', 0.000004, { style: 'decimal', maximumFractionDigits: 7 }))).toEqual('0,000004');
      expect((await runLocaleFunction(page, 'formatNumber', 145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 }))).toEqual('145.000,00000');

      await runLocaleFunction(page, 'setLocale', 'ar-EG');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1))).toEqual('١٢٬٣٤٥٫١٠');

      await runLocaleFunction(page, 'setLocale', 'bg-BG');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1))).toEqual('12 345,10');
    });

    test('can round decimals', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 123456.123456, { style: 'decimal', maximumFractionDigits: 5 }))).toEqual('123,456.12346');
      expect((await runLocaleFunction(page, 'formatNumber', 123456.123456, { style: 'decimal', maximumFractionDigits: 4 }))).toEqual('123,456.1235');
      expect((await runLocaleFunction(page, 'formatNumber', 1.001, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3 }))).toEqual('1.001');
      expect((await runLocaleFunction(page, 'formatNumber', 1.001, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 }))).toEqual('1.001');
      expect((await runLocaleFunction(page, 'formatNumber', 1.0019, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 }))).toEqual('1.002');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.6789, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3 }))).toEqual('12,345.679');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.6789, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 }))).toEqual('12,345.679');
    });

    test('can format integers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 12345.123, { minimumFractionDigits: 0, maximumFractionDigits: 0 }))).toEqual('12,345');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', 145000, { minimumFractionDigits: 0, maximumFractionDigits: 0 }))).toEqual('145.000');
      expect((await runLocaleFunction(page, 'formatNumber', 283423, { minimumFractionDigits: 0, maximumFractionDigits: 0 }))).toEqual('283.423');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.123, { minimumFractionDigits: 0, maximumFractionDigits: 0 }))).toEqual('12.345');
    });

    test('cab handle locale group size', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 1234567.1234))).toEqual('1,234,567.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345678.1234))).toEqual('12,345,678.123');

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567.1234))).toEqual('1.234.567,123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345678.1234))).toEqual('12.345.678,123');

      await runLocaleFunction(page, 'setLocale', 'hi-IN');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567.1234))).toEqual('12,34,567.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345678.1234))).toEqual('1,23,45,678.123');
    });

    test('can parse string numbers to number type', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', '12345', { minimumFractionDigits: 0 }))).toEqual('12,345');
    });

    test('can format currency', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 12345.129, {
        style: 'currency', currency: 'USD'
      }))).toEqual('$12,345.13');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.123, {
        style: 'currency', currency: 'EUR'
      }))).toEqual('12.345,12 €');
    });

    test('can override currency', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'es-ES');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.12, {
        style: 'currency', currency: 'USD'
      }))).toEqual('12.345,12 US$');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.12, {
        style: 'currency', currency: 'USD'
      }))).toEqual('12.345,12 $');
    });

    test('can format percent', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', 0.0500000, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('5%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.050000, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('5%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.05234, { style: 'percent', minimumFractionDigits: 4, maximumFractionDigits: 4 }))).toEqual('5.2340%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.57, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('57%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.57, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }))).toEqual('57.00%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.5700, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }))).toEqual('57.00%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.57010, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }))).toEqual('57.01%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.5755, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }))).toEqual('57.55%');
      expect((await runLocaleFunction(page, 'formatNumber', -2.53, { style: 'percent', minimumFractionDigits: 2 }))).toEqual('-253.00%');
      expect((await runLocaleFunction(page, 'formatNumber', -2.53, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('-253%');
      expect((await runLocaleFunction(page, 'formatNumber', 0.10, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('10%');
      expect((await runLocaleFunction(page, 'formatNumber', 1, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('100%');

      await runLocaleFunction(page, 'setLocale', 'tr-TR');
      expect((await runLocaleFunction(page, 'formatNumber', 0.0500000, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('%5');

      await runLocaleFunction(page, 'setLocale', 'it-IT');
      expect((await runLocaleFunction(page, 'formatNumber', 0.0500000, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('5%');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatNumber', -2.53, { style: 'percent', minimumFractionDigits: 2 }))).toEqual('-253,00 %');
      expect((await runLocaleFunction(page, 'formatNumber', -2.53, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('-253 %');
      expect((await runLocaleFunction(page, 'formatNumber', 0.10, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('10 %');
      expect((await runLocaleFunction(page, 'formatNumber', 1, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('100 %');
    });

    test('can handle group size', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', -2.53, { style: 'percent', minimumFractionDigits: 2 }))).toEqual('-253.00%');
      expect((await runLocaleFunction(page, 'formatNumber', 1.1234))).toEqual('1.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12.1234))).toEqual('12.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123.1234))).toEqual('123.123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234.1234))).toEqual('1,234.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1234))).toEqual('12,345.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456.1234))).toEqual('123,456.123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567.1234))).toEqual('1,234,567.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345678.1234))).toEqual('12,345,678.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234))).toEqual('123,456,789.123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567890.1234))).toEqual('1,234,567,890.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234, { style: 'currency', currency: 'USD' }))).toEqual('$123,456,789.12');
      expect((await runLocaleFunction(page, 'formatNumber', 100, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('10,000%');

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      expect((await runLocaleFunction(page, 'formatNumber', -2.53, { style: 'percent', minimumFractionDigits: 2 }))).toEqual('-253,00%');
      expect((await runLocaleFunction(page, 'formatNumber', 1.1234))).toEqual('1,123');
      expect((await runLocaleFunction(page, 'formatNumber', 12.1234))).toEqual('12,123');
      expect((await runLocaleFunction(page, 'formatNumber', 123.1234))).toEqual('123,123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234.1234))).toEqual('1.234,123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1234))).toEqual('12.345,123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456.1234))).toEqual('123.456,123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567.1234))).toEqual('1.234.567,123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345678.1234))).toEqual('12.345.678,123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234))).toEqual('123.456.789,123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567890.1234))).toEqual('1.234.567.890,123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234, { style: 'currency', currency: 'EUR' }))).toEqual('€ 123.456.789,12');
      expect((await runLocaleFunction(page, 'formatNumber', 100, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('10.000%');

      await runLocaleFunction(page, 'setLocale', 'hi-IN');
      expect((await runLocaleFunction(page, 'formatNumber', -2.53, { style: 'percent', minimumFractionDigits: 2 }))).toEqual('-253.00%');
      expect((await runLocaleFunction(page, 'formatNumber', 1.1234))).toEqual('1.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12.1234))).toEqual('12.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123.1234))).toEqual('123.123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234.1234))).toEqual('1,234.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345.1234))).toEqual('12,345.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456.1234))).toEqual('1,23,456.123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567.1234))).toEqual('12,34,567.123');
      expect((await runLocaleFunction(page, 'formatNumber', 12345678.1234))).toEqual('1,23,45,678.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234))).toEqual('12,34,56,789.123');
      expect((await runLocaleFunction(page, 'formatNumber', 1234567890.1234))).toEqual('1,23,45,67,890.123');
      expect((await runLocaleFunction(page, 'formatNumber', 123456789.1234, { style: 'currency', currency: 'INR' }))).toEqual('₹12,34,56,789.12');
      expect((await runLocaleFunction(page, 'formatNumber', 100, { style: 'percent', minimumFractionDigits: 0 }))).toEqual('10,000%');
    });
  });

  test.describe('number parsing tests', () => {
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can handle numbers passed to parseNumber', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', 4000))).toEqual(4000);
    });

    test('can handle group when passed to parseNumber', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', '4.000', { group: '.' }))).toEqual(4000);
    });

    test('can handle percentSign when passed to parseNumber', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', '%40', { percentSign: '%' }))).toEqual(40);
    });

    test('can handle currencySign when passed to parseNumber', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', '€4,000', { currencySign: '€' }))).toEqual(4000);
    });

    test('can handle big numbers ending in decimal', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', '-1,482,409,800.81'))).toEqual('-1,482,409,800.81');
      expect((await runLocaleFunction(page, 'parseNumber', '-1,482,409,800.81'))).toEqual(-1482409800.81);
    });

    test('can handle other big numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatNumber', '123456789012345671'))).toEqual('123,456,789,012,345,671.00');
      expect((await runLocaleFunction(page, 'parseNumber', '123456789012345671'))).toEqual('123456789012345671');
      expect((await runLocaleFunction(page, 'formatNumber', '123456789012345678'))).toEqual('123,456,789,012,345,678.00');
      expect((await runLocaleFunction(page, 'parseNumber', '123456789012345678'))).toEqual('123456789012345678');
      expect((await runLocaleFunction(page, 'parseNumber', '123456789012345680'))).toEqual('123456789012345680');
      expect((await runLocaleFunction(page, 'parseNumber', '12345678910'))).toEqual(12345678910);
      expect((await runLocaleFunction(page, 'parseNumber', '12345678900'))).toEqual(12345678900);
      expect((await runLocaleFunction(page, 'parseNumber', '123456789100'))).toEqual(123456789100);
      expect((await runLocaleFunction(page, 'parseNumber', '1234567890123456710'))).toEqual('1234567890123456710');
      expect((await runLocaleFunction(page, 'parseNumber', '1234567890123456700'))).toEqual('1234567890123456700');
      expect((await runLocaleFunction(page, 'parseNumber', '9007199254740991'))).toEqual(9007199254740991);
    });

    test('can parse numbers back', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', '$12,345.13'))).toEqual(12345.13);

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'parseNumber', '12.345,12 €'))).toEqual(12345.12);
    });

    test('can format numbers in current locale', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'nl-NL');

      expect((await runLocaleFunction(page, 'parseNumber', '100,00'))).toEqual(100);
      expect((await runLocaleFunction(page, 'parseNumber', '836,45'))).toEqual(836.45);
      expect((await runLocaleFunction(page, 'parseNumber', '1200,12'))).toEqual(1200.12);
      expect((await runLocaleFunction(page, 'parseNumber', '10,99'))).toEqual(10.99);
      expect((await runLocaleFunction(page, 'parseNumber', '130300,00'))).toEqual(130300.00);
    });

    test('can return NaN for invalid numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', ''))).toEqual(NaN);
      expect((await runLocaleFunction(page, 'parseNumber', 'sdf'))).toEqual(NaN);
    });

    test('can parse with decimal and group properties', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'fr-FR');
      expect((await runLocaleFunction(page, 'parseNumber', '1 234 567 890,1234'))).toEqual(1234567890.1234);

      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      expect((await runLocaleFunction(page, 'parseNumber', '1٬234٬567٬890٫1234'))).toEqual(1234567890.1234);

      await runLocaleFunction(page, 'setLocale', 'es-ES');
      expect((await runLocaleFunction(page, 'parseNumber', '1.234.567.890,1234'))).toEqual(1234567890.1234);

      await runLocaleFunction(page, 'setLocale', 'en-US');
      expect((await runLocaleFunction(page, 'parseNumber', '1,234,567,890.1234'))).toEqual(1234567890.1234);
    });

    test('can parse with multiple group separators', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', '1,234,567,890.12346'))).toEqual(1234567890.12346);
    });

    test('can parse big numbers', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', '123456,789,012,345,678.123456'))).toEqual('123456789012345678.123456');
      expect((await runLocaleFunction(page, 'parseNumber', '1123456789123456.57'))).toEqual('1123456789123456.57');
      expect((await runLocaleFunction(page, 'parseNumber', '1,123,456,789,123,456.57'))).toEqual('1123456789123456.57');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'parseNumber', '123.456.789.012.345.678,123456'))).toEqual('123456789012345678.123456');
    });

    test('can parse group size', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseNumber', '-253.00 %'))).toEqual(-253);
      expect((await runLocaleFunction(page, 'parseNumber', '1.123'))).toEqual(1.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12.123'))).toEqual(12.123);
      expect((await runLocaleFunction(page, 'parseNumber', '123.123'))).toEqual(123.123);
      expect((await runLocaleFunction(page, 'parseNumber', '1,234.123'))).toEqual(1234.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12,345.123'))).toEqual(12345.123);
      expect((await runLocaleFunction(page, 'parseNumber', '123,456.123'))).toEqual(123456.123);
      expect((await runLocaleFunction(page, 'parseNumber', '1234,567.123'))).toEqual(1234567.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12345,678.123'))).toEqual((12345678.123));
      expect((await runLocaleFunction(page, 'parseNumber', '123456,789.123'))).toEqual((123456789.123));
      expect((await runLocaleFunction(page, 'parseNumber', '1234567,890.123'))).toEqual((1234567890.123));
      expect((await runLocaleFunction(page, 'parseNumber', '$123456,789.12'))).toEqual((123456789.12));
      expect((await runLocaleFunction(page, 'parseNumber', '10,000 %'))).toEqual((10000));

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      expect((await runLocaleFunction(page, 'parseNumber', '-253,00 %'))).toEqual(-253);
      expect((await runLocaleFunction(page, 'parseNumber', '1,123'))).toEqual(1.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12,123'))).toEqual(12.123);
      expect((await runLocaleFunction(page, 'parseNumber', '123,123'))).toEqual(123.123);
      expect((await runLocaleFunction(page, 'parseNumber', '1.234,123'))).toEqual(1234.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12.345,123'))).toEqual(12345.123);
      expect((await runLocaleFunction(page, 'parseNumber', '123.456,123'))).toEqual(123456.123);
      expect((await runLocaleFunction(page, 'parseNumber', '1234.567,123'))).toEqual(1234567.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12.345.678,123'))).toEqual((12345678.123));
      expect((await runLocaleFunction(page, 'parseNumber', '123.456.789,123'))).toEqual((123456789.123));
      expect((await runLocaleFunction(page, 'parseNumber', '1.234.567.890,123'))).toEqual((1234567890.123));
      expect((await runLocaleFunction(page, 'parseNumber', '$123.456.789,12'))).toEqual((123456789.12));
      expect((await runLocaleFunction(page, 'parseNumber', '10.000 %'))).toEqual((10000));

      await runLocaleFunction(page, 'setLocale', 'hi-IN');
      expect((await runLocaleFunction(page, 'parseNumber', '-253.00 %'))).toEqual(-253);
      expect((await runLocaleFunction(page, 'parseNumber', '1.123'))).toEqual(1.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12.123'))).toEqual(12.123);
      expect((await runLocaleFunction(page, 'parseNumber', '123.123'))).toEqual(123.123);
      expect((await runLocaleFunction(page, 'parseNumber', '1,234.123'))).toEqual(1234.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12,345.123'))).toEqual(12345.123);
      expect((await runLocaleFunction(page, 'parseNumber', '1,23,456.123'))).toEqual(123456.123);
      expect((await runLocaleFunction(page, 'parseNumber', '12,34,567.123'))).toEqual(1234567.123);
      expect((await runLocaleFunction(page, 'parseNumber', '1,23,45,678.123'))).toEqual((12345678.123));
      expect((await runLocaleFunction(page, 'parseNumber', '12,34,56,789.123'))).toEqual((123456789.123));
      expect((await runLocaleFunction(page, 'parseNumber', '1,23,45,67,890.123'))).toEqual((1234567890.123));
      expect((await runLocaleFunction(page, 'parseNumber', '₹12,34,56,789.12'))).toEqual((123456789.12));
      expect((await runLocaleFunction(page, 'parseNumber', '10,000 %'))).toEqual((10000));
    });

    test('can parse a number in a a non current locale', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      await runLocaleFunction(page, 'setLocale', 'hi-IN');
      await runLocaleFunction(page, 'setLocale', 'en-US');

      expect((await runLocaleFunction(page, 'parseNumber', '-253,00 %', { locale: 'nl-NL' }))).toEqual(-253);
      expect((await runLocaleFunction(page, 'parseNumber', '1.123', { locale: 'nl-NL' }))).toEqual(1123);
      expect((await runLocaleFunction(page, 'parseNumber', '$123456.789,12', { locale: 'nl-NL' }))).toEqual((123456789.12));
      expect((await runLocaleFunction(page, 'parseNumber', '€123456.789,12', { locale: 'nl-NL' }))).toEqual((123456789.12));
      expect((await runLocaleFunction(page, 'parseNumber', '10.000 %', { locale: 'nl-NL' }))).toEqual((10000));
      expect((await runLocaleFunction(page, 'parseNumber', '-253.00 %', { locale: 'hi-IN' }))).toEqual(-253);
      expect((await runLocaleFunction(page, 'parseNumber', '1.123', { locale: 'hi-IN' }))).toEqual(1.123);
      expect((await runLocaleFunction(page, 'parseNumber', '₹12,34,56,789.12', { locale: 'hi-IN' }))).toEqual((123456789.12));
      expect((await runLocaleFunction(page, 'parseNumber', '10,000 %', { locale: 'hi-IN' }))).toEqual((10000));
    });
  });

  test.describe('date formatting tests', () => {
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can parse ISO (JSON) dates', async ({ page }) => {
      expect(await page.evaluate(() => ((window as any).utils as any).locale.parseDate('2019-12-12T18:25:43.511Z').getTime())).toEqual(1576175143511);
    });

    test('can parse 2 and 3 digit years', async ({ page }) => {
      expect(await page.evaluate(() => ((window as any).utils as any).locale.parseDate('10/10/10', { dateFormat: 'M/d/yy' }).getFullYear())).toEqual(2010);
      expect(await page.evaluate(() => ((window as any).utils as any).locale.parseDate('10/10/010', { dateFormat: 'M/d/yy' }).getFullYear())).toEqual(2010);
    });

    test('can parse or format a string of four, six, or eight zeroes', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseDate', '0000'))).toEqual(undefined);
      expect((await runLocaleFunction(page, 'parseDate', '000000'))).toEqual(undefined);
      expect((await runLocaleFunction(page, 'parseDate', '00000000'))).toEqual(undefined);

      expect((await runLocaleFunction(page, 'formatDate', '0000'))).toEqual('');
      expect((await runLocaleFunction(page, 'formatDate', '000000'))).toEqual('');
      expect((await runLocaleFunction(page, 'formatDate', '00000000'))).toEqual('');
    });

    test('can format 2 digit years', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2039, 6, 21), { pattern: 'dd/MM/yy' }))).toEqual('21/07/39');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(1940, 6, 21), { pattern: 'dd/MM/yy' }))).toEqual('21/07/40');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2023, 11, 21), { pattern: 'dd/MM/yy' }))).toEqual('21/12/23');
    });

    test('can format a year and month locale', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 40), { month: 'long', day: 'numeric' }))).toEqual('November 8');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 0), { month: 'long', year: 'numeric' }))).toEqual('November 2000');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 11, 1, 13, 40), { month: 'long', day: 'numeric' }))).toEqual('1. Dezember');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 11, 1, 13, 5), { month: 'long', year: 'numeric' }))).toEqual('Dezember 2000');

      await runLocaleFunction(page, 'setLocale', 'sv-SE');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 11, 1, 13, 40), { month: 'long', day: 'numeric' }))).toEqual('1 december');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 11, 1, 13, 5), { month: 'long', year: 'numeric' }))).toEqual('december 2000');
    });

    test('can format datetimeMillis and timestampMillis', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 40, 30, 999), {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3
      })).replace(' ', ' ').replace(' ', ' ')).toEqual('11/8/2000 1:40:30.999 PM');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 40, 30, 777), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3
      })).replace(' ', ' ')).toEqual('1:40:30.777 PM');
    });

    test('can return time format', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40, 45), { timeStyle: 'medium' })).replace(' ', ' ').replace(' ', ' ')).toEqual('1:40:45 PM');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40, 45), { timeStyle: 'medium' }))).toEqual('13:40:45');
    });

    test('can format dates in Slovak', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'sk-SK');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 7, 15), {
        month: 'long', weekday: 'long', day: 'numeric', year: 'numeric'
      }))).toEqual('štvrtok 15. augusta 2019');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 7, 15), {
        month: 'long', weekday: 'long', day: 'numeric', year: 'numeric'
      }))).toEqual('štvrtok 15. augusta 2019');
    });

    test('can format time in different locale', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 40), { dateStyle: 'short', timeStyle: 'short' })).replace(' ', ' ').replace(' ', ' ')).toEqual('11/8/2000 1:40 PM');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 0), { dateStyle: 'short', timeStyle: 'short' })).replace(' ', ' ').replace(' ', ' ')).toEqual('11/8/2000 1:00 PM');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 11, 1, 13, 40), { dateStyle: 'short', timeStyle: 'short' })).replace(' ', ' ')).toEqual('01.12.2000 13:40');

      const date = await pageDate.newDate(2017, 1, 1, 17, 27, 40);
      const opts = { dateStyle: 'short', timeStyle: 'short' };

      await runLocaleFunction(page, 'setLocale', 'fi-FI');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(' ', ' ')).toEqual('1.2.2017 klo 17.27');

      await runLocaleFunction(page, 'setLocale', 'cs-CZ');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(' ', ' ')).toEqual('01.02.2017 17:27');

      await runLocaleFunction(page, 'setLocale', 'hu-HU');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(' ', ' ').replace(' ', ' ').replace(' ', ' ')).toEqual('2017. 02. 01. 17:27');

      await runLocaleFunction(page, 'setLocale', 'ja-JP');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(' ', ' ')).toEqual('2017/02/01 17:27');

      await runLocaleFunction(page, 'setLocale', 'ru-RU');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(' ', ' ')).toEqual('01.02.2017 17:27');
    });

    test('can format other dates', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8)))).toEqual('8.11.2000');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 11, 1)))).toEqual('1.12.2000');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8), { dateStyle: 'short' }))).toEqual('08.11.2000');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8), { dateStyle: 'medium' }))).toEqual('08.11.2000');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8), { dateStyle: 'long' })).replace(' ', ' ').replace(' ', ' ')).toEqual('8. November 2000');
    });

    test('can format millis', async ({ page, pageDate }) => {
      const opts: any = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3
      };
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2016, 2, 15, 12, 30, 36, 142), opts)).replace(' ', ' ').replace(' ', ' ')).toEqual('3/15/2016 12:30:36.142 PM');
      opts.hour12 = false;
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2016, 2, 15, 12, 30, 36, 142), opts)).replace(' ', ' ')).toEqual('3/15/2016 12:30:36.142');
    });

    test('can format timestamp in English', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 10, 5, 10, 20, 5), { timeStyle: 'medium' })).replace(' ', ' ').replace(' ', ' ')).toEqual('10:20:05 AM');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 10, 5, 10, 20, 5), { timeStyle: 'short' })).replace(' ', ' ').replace(' ', ' ')).toEqual('10:20 AM');

      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8)))).toEqual('11/8/2000');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8), { dateStyle: 'short' }))).toEqual('11/8/2000');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8), { dateStyle: 'medium' }))).toEqual('Nov 8, 2000');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8), { dateStyle: 'long' }))).toEqual('November 8, 2000');
    });

    test('can format timestamp in Arabic', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 12, 1), { month: 'long', day: 'numeric' }))).toEqual('٦ شوال');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2017, 10, 8), { month: 'long', day: 'numeric' }))).toEqual('١٩ صفر');
    });

    test('can format date in a non current language', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      await runLocaleFunction(page, 'setLocale', 'hi-IN');
      await runLocaleFunction(page, 'setLocale', 'en-US');

      expect((await runLocaleFunction(page, 'calendar', '')).dateFormat.short).toEqual('M/d/yyyy');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 5, 8), {
        locale: 'nl', month: 'long', day: 'numeric', year: 'numeric'
      }))).toEqual('8 juni 2019');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 5, 8), {
        locale: 'hi', month: 'short', day: 'numeric', year: 'numeric'
      }))).toEqual('8 जून 2019');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 5, 8), {
        locale: 'hi', month: 'long', day: 'numeric', year: 'numeric'
      }))).toEqual('8 जून 2019');
    });

    test('can format month in Arabic', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 12, 1), { month: 'long', day: 'numeric' }))).toEqual('٦ شوال');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2017, 10, 8), { month: 'long', day: 'numeric' }))).toEqual('١٩ صفر');
    });

    test('can format year in da-DK', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'da-DK');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 3, 1), { month: 'long', year: 'numeric' }))).toEqual('april 2019');
    });

    test('can format Hebrew dates', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'he-IL');

      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 12, 1), { dateStyle: 'short' }))).toEqual('1.1.2020');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 10, 8), { dateStyle: 'medium' }))).toEqual('8 בנוב׳ 2019');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 10, 8), { dateStyle: 'long' }))).toEqual('8 בנובמבר 2019');
    });

    test('can format zh-Hans dates', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'zh-Hans');

      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 12, 1), { dateStyle: 'short' }))).toEqual('2020/1/1');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 10, 8), { dateStyle: 'medium' }))).toEqual('2019年11月8日');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2019, 10, 8), { dateStyle: 'long' }))).toEqual('2019年11月8日');
    });

    test('can format year in es-ES', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'es-ES');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10), { month: 'long', year: 'numeric' }))).toEqual('noviembre de 2018');
    });

    test('can format datetime in es-419', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'es-419');

      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10)))).toEqual('10/11/2018');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10), { dateStyle: 'long' }))).toEqual('10 de noviembre de 2018');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10), { dateStyle: 'full' }))).toEqual('sábado, 10 de noviembre de 2018');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10), { month: 'long', day: 'numeric' }))).toEqual('10 de noviembre');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10), { month: 'long', year: 'numeric' }))).toEqual('noviembre de 2018');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10, 14, 15, 12), { timeStyle: 'medium' }))).toEqual('2:15:12 p.m.');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10, 14, 15, 12), { timeStyle: 'short' }))).toEqual('2:15 p.m.');
      expect((await runLocaleFunction(page, 'formatDate', '29/3/2018 14:15', {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', dateFormat: 'd/M/yyyy HH:mm'
      }))).toEqual('29/3/2018 2:15 p.m.');

      let opts: any = {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
      };
      let date = await pageDate.newDate(2018, 10, 10, 14, 15, 12);
      expect((await runLocaleFunction(page, 'formatDate', date, opts))).toEqual((await pageDate.format(date, 'es-419', opts)).replace(',', ''));

      opts = {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long'
      };
      date = new Date(2018, 10, 10);
      expect((await runLocaleFunction(page, 'formatDate', date, opts))).toEqual((await pageDate.format(date, 'es-419', opts)).replace(',', ''));

      opts = {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'
      };
      date = new Date(2018, 10, 10);
      expect((await runLocaleFunction(page, 'formatDate', date, opts))).toEqual((await pageDate.format(date, 'es-419', opts)).replace(',', ''));
    });

    test('can format long in different locale', async ({ page, pageDate }) => {
      const date = await pageDate.newDate(2015, 0, 8, 13, 40);
      const testData = [
        { locale: 'en-US', expected: 'January 8, 2015' },
        { locale: 'de-DE', expected: '8. Januar 2015' },
        { locale: 'es-ES', expected: '8 de enero de 2015' },
        { locale: 'lt-LT', expected: '2015 m. sausio 8 d.' },
        { locale: 'vi-VN', expected: '8 tháng 1, 2015' }
      ];

      for (const data of testData) {
        await runLocaleFunction(page, 'setLocale', data.locale);
        expect((await runLocaleFunction(page, 'formatDate', date, { dateStyle: 'long' }))).toEqual(data.expected);
      }
    });

    test('can format full', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { dateStyle: 'full' }))).toEqual('Thursday, January 8, 2015');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 2, 7, 13, 40), { dateStyle: 'full' }))).toEqual('Saturday, March 7, 2015');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 1, 13, 40), { dateStyle: 'full' }))).toEqual('Donnerstag, 1. Januar 2015');
    });

    test('can format long days in different locale', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { dateStyle: 'long' })).replace(' ', ' ').replace(' ', ' ')).toEqual('January 8, 2015');

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 1, 13, 40), { dateStyle: 'long' }))).toEqual('1. Januar 2015');

      await runLocaleFunction(page, 'setLocale', 'ar-EG');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 1, 13, 40), { dateStyle: 'long' }))).toEqual('١ يناير ٢٠١٥');

      await runLocaleFunction(page, 'setLocale', 'bg-BG');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 1, 13, 40), { dateStyles: 'long' })).replace(' ', ' ')).toEqual('1.01.2015 г.');
    });

    test('can format with numeric patterns', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'yyyy' }))).toEqual('2015');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'dd' }))).toEqual('08');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'd' }))).toEqual('8');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'M' }))).toEqual('1');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 1, 13, 40), { pattern: 'M.dd.yyyy' }))).toEqual('1.01.2015');
    });

    test('can format with long patterns', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'MMMM d, yyyy' }))).toEqual('January 8, 2015');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'MMMM yyyy' }))).toEqual('January 2015');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'MMM yyyy' }))).toEqual('Jan 2015');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'MMMM dd' }))).toEqual('January 08');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'MMMM d' }))).toEqual('January 8');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'MMM d' }))).toEqual('Jan 8');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'd MMM, yyyy' }))).toEqual('8 Jan, 2015');

      await runLocaleFunction(page, 'setLocale', 'vi-VN');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'd MMMM, yyyy' }))).toEqual('8 Tháng Giêng, 2015');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'd MMM, yyyy' }))).toEqual('8 Thg1, 2015');

      await runLocaleFunction(page, 'setLocale', 'pt-PT');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'd de MMMM de yyyy' }))).toEqual('8 de Janeiro de 2015');

      await runLocaleFunction(page, 'setLocale', 'bg-BG');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2015, 0, 8, 13, 40), { pattern: 'd MMMM yyyy г.' }))).toEqual('8 януари 2015 г.');
    });

    test('can format with time and day period patterns', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10, 14, 15, 12), { pattern: 'HH:mm:ss' }))).toEqual('14:15:12');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2018, 10, 10, 2, 15, 12), { pattern: 'H:mm' }))).toEqual('2:15');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 40, 30, 777), {
        pattern: 'h:mm:ss.SSS a'
      }))).toEqual('1:40:30.777 PM');
      expect((await runLocaleFunction(page, 'formatDate', await pageDate.newDate(2000, 10, 8, 13, 40, 30, 777), {
        pattern: 'H:mm:ss.SSS'
      }))).toEqual('13:40:30.777');
    });

    test('can format dates into another timezone with long timezone name', async ({ page, pageDate }) => {
      const opts: any = {
        timeZoneName: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric'
      };

      opts.timeZone = 'Australia/Brisbane';
      const date = await pageDate.newDate(2018, 2, 26);
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      opts.timeZone = 'Asia/Shanghai';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));
      opts.timeZone = 'America/New_York';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      opts.timeZone = 'Australia/Brisbane';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'nl-NL', opts)).replace(',', '').replace(/ /g, ' '));
      opts.timeZone = 'Asia/Shanghai';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)))
        .toEqual((await pageDate.format(date, 'nl-NL', opts)).replace(',', '').replace(/ /g, ' '));
    });

    test('can format dates into another timezone with short timezone name', async ({ page, pageDate }) => {
      const opts: any = {
        timeZoneName: 'short', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric'
      };

      opts.timeZone = 'Australia/Brisbane';
      const date = await pageDate.newDate(2018, 2, 26);
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      opts.timeZone = 'Asia/Shanghai';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));
      opts.timeZone = 'America/New_York';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      opts.timeZone = 'Australia/Brisbane';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'nl-NL', opts)).replace(',', '').replace(/ /g, ' '));
      opts.timeZone = 'Asia/Shanghai';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)))
        .toEqual((await pageDate.format(date, 'nl-NL', opts)).replace(',', '').replace(/ /g, ' '));
    });

    test('can format dates in another timezone', async ({ page, pageDate }) => {
      const opts: any = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      opts.timeZone = 'Australia/Brisbane';
      const date = await pageDate.newDate(2018, 2, 26);
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      opts.timeZone = 'Asia/Shanghai';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));
      opts.timeZone = 'America/New_York';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      opts.timeZone = 'Australia/Brisbane';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'nl-NL', opts)).replace(',', '').replace(/ /g, ' '));
      opts.timeZone = 'Asia/Shanghai';
      expect((await runLocaleFunction(page, 'formatDate', date, opts)))
        .toEqual((await pageDate.format(date, 'nl-NL', opts)).replace(',', '').replace(/ /g, ' '));
    });

    test('can format dates in different timezones', async ({ page, pageDate }) => {
      const opts: any = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      };

      const date = new Date(2020, 6, 22, 21, 11, 12);
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'hr-HR');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'hr-HR', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'it-IT');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'it-IT', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'zh-Hant');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'zh-Hant', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'zh-TW');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)))
        .toEqual((await pageDate.format(date, 'zh-TW', opts)).replace(',', '').replace(/ /g, ' '));
    });

    test('can format dates with long timezones', async ({ page, pageDate }) => {
      const opts: any = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'long'
      };

      const date = await pageDate.newDate(2018, 2, 22, 20, 11, 12);
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'en-US', opts)).replace(',', '').replace(/ /g, ' '));

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      expect((await runLocaleFunction(page, 'formatDate', date, opts)).replace(/ /g, ' '))
        .toEqual((await pageDate.format(date, 'nl-NL', opts)).replace(',', '').replace(/ /g, ' '));
    });
  });

  test.describe('hour formatting tests', () => {
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can format hours', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatHour', 0)).replace(' ', ' ')).toEqual('12:00 AM');
      expect((await runLocaleFunction(page, 'formatHour', '1')).replace(' ', ' ')).toEqual('1:00 AM');
      expect((await runLocaleFunction(page, 'formatHour', '0:30')).replace(' ', ' ')).toEqual('12:30 AM');
      expect((await runLocaleFunction(page, 'formatHour', 0.5)).replace(' ', ' ')).toEqual('12:30 AM');
      expect((await runLocaleFunction(page, 'formatHour', 5)).replace(' ', ' ')).toEqual('5:00 AM');
      expect((await runLocaleFunction(page, 'formatHour', '5:30')).replace(' ', ' ')).toEqual('5:30 AM');
      expect((await runLocaleFunction(page, 'formatHour', 5.5)).replace(' ', ' ')).toEqual('5:30 AM');
      expect((await runLocaleFunction(page, 'formatHour', 10)).replace(' ', ' ')).toEqual('10:00 AM');
      expect((await runLocaleFunction(page, 'formatHour', '10:30')).replace(' ', ' ')).toEqual('10:30 AM');
      expect((await runLocaleFunction(page, 'formatHour', 10.5)).replace(' ', ' ')).toEqual('10:30 AM');
      expect((await runLocaleFunction(page, 'formatHour', 12)).replace(' ', ' ')).toEqual('12:00 PM');
      expect((await runLocaleFunction(page, 'formatHour', '12:30')).replace(' ', ' ')).toEqual('12:30 PM');
      expect((await runLocaleFunction(page, 'formatHour', 12.5)).replace(' ', ' ')).toEqual('12:30 PM');
      expect((await runLocaleFunction(page, 'formatHour', 15)).replace(' ', ' ')).toEqual('3:00 PM');
      expect((await runLocaleFunction(page, 'formatHour', '15:30')).replace(' ', ' ')).toEqual('3:30 PM');
      expect((await runLocaleFunction(page, 'formatHour', 15.5)).replace(' ', ' ')).toEqual('3:30 PM');
      expect((await runLocaleFunction(page, 'formatHour', 20)).replace(' ', ' ')).toEqual('8:00 PM');
      expect((await runLocaleFunction(page, 'formatHour', '20:30')).replace(' ', ' ')).toEqual('8:30 PM');
      expect((await runLocaleFunction(page, 'formatHour', 20.5)).replace(' ', ' ')).toEqual('8:30 PM');
      expect((await runLocaleFunction(page, 'formatHour', 24)).replace(' ', ' ')).toEqual('12:00 AM');
      expect((await runLocaleFunction(page, 'formatHour', '24:30')).replace(' ', ' ')).toEqual('12:30 AM');
      expect((await runLocaleFunction(page, 'formatHour', 24.5)).replace(' ', ' ')).toEqual('12:30 AM');
    });

    test('can format hours in de-DE', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'de-DE');

      expect((await runLocaleFunction(page, 'formatHour', 0))).toEqual('00:00');
      expect((await runLocaleFunction(page, 'formatHour', '0:30'))).toEqual('00:30');
      expect((await runLocaleFunction(page, 'formatHour', 5))).toEqual('05:00');
      expect((await runLocaleFunction(page, 'formatHour', '5:30'))).toEqual('05:30');
      expect((await runLocaleFunction(page, 'formatHour', 10))).toEqual('10:00');
      expect((await runLocaleFunction(page, 'formatHour', '10:30'))).toEqual('10:30');
      expect((await runLocaleFunction(page, 'formatHour', 12))).toEqual('12:00');
      expect((await runLocaleFunction(page, 'formatHour', '12:30'))).toEqual('12:30');
      expect((await runLocaleFunction(page, 'formatHour', 15))).toEqual('15:00');
      expect((await runLocaleFunction(page, 'formatHour', '15:30'))).toEqual('15:30');
      expect((await runLocaleFunction(page, 'formatHour', 20))).toEqual('20:00');
      expect((await runLocaleFunction(page, 'formatHour', '20:30'))).toEqual('20:30');
      expect((await runLocaleFunction(page, 'formatHour', 24))).toEqual('00:00');
      expect((await runLocaleFunction(page, 'formatHour', '24:30'))).toEqual('00:30');
    });

    test('can format hours in da-DK', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'da-DK');

      expect((await runLocaleFunction(page, 'formatHour', 0))).toEqual('00.00');
      expect((await runLocaleFunction(page, 'formatHour', '0:30'))).toEqual('00.30');
      expect((await runLocaleFunction(page, 'formatHour', 5))).toEqual('05.00');
      expect((await runLocaleFunction(page, 'formatHour', '5:30'))).toEqual('05.30');
      expect((await runLocaleFunction(page, 'formatHour', 10))).toEqual('10.00');
      expect((await runLocaleFunction(page, 'formatHour', '10:30'))).toEqual('10.30');
      expect((await runLocaleFunction(page, 'formatHour', 12))).toEqual('12.00');
      expect((await runLocaleFunction(page, 'formatHour', '12:30'))).toEqual('12.30');
      expect((await runLocaleFunction(page, 'formatHour', 15))).toEqual('15.00');
      expect((await runLocaleFunction(page, 'formatHour', '15:30'))).toEqual('15.30');
      expect((await runLocaleFunction(page, 'formatHour', 20))).toEqual('20.00');
      expect((await runLocaleFunction(page, 'formatHour', '20:30'))).toEqual('20.30');
      expect((await runLocaleFunction(page, 'formatHour', 24))).toEqual('00.00');
      expect((await runLocaleFunction(page, 'formatHour', '24:30'))).toEqual('00.30');
    });

    test('can format hours in fi-FI', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'fi-FI');

      expect((await runLocaleFunction(page, 'formatHour', 0))).toEqual('0.00');
      expect((await runLocaleFunction(page, 'formatHour', '0:30'))).toEqual('0.30');
      expect((await runLocaleFunction(page, 'formatHour', 5))).toEqual('5.00');
      expect((await runLocaleFunction(page, 'formatHour', '5:30'))).toEqual('5.30');
      expect((await runLocaleFunction(page, 'formatHour', 10))).toEqual('10.00');
      expect((await runLocaleFunction(page, 'formatHour', '10:30'))).toEqual('10.30');
      expect((await runLocaleFunction(page, 'formatHour', 12))).toEqual('12.00');
      expect((await runLocaleFunction(page, 'formatHour', '12:30'))).toEqual('12.30');
      expect((await runLocaleFunction(page, 'formatHour', 15))).toEqual('15.00');
      expect((await runLocaleFunction(page, 'formatHour', '15:30'))).toEqual('15.30');
      expect((await runLocaleFunction(page, 'formatHour', 20))).toEqual('20.00');
      expect((await runLocaleFunction(page, 'formatHour', '20:30'))).toEqual('20.30');
      expect((await runLocaleFunction(page, 'formatHour', 24))).toEqual('0.00');
      expect((await runLocaleFunction(page, 'formatHour', '24:30'))).toEqual('0.30');
    });

    test('can format hours in ko-KR', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'ko-KR');

      expect((await runLocaleFunction(page, 'formatHour', 0))).toEqual('오전 12:00');
      expect((await runLocaleFunction(page, 'formatHour', '0:30'))).toEqual('오전 12:30');
      expect((await runLocaleFunction(page, 'formatHour', 5))).toEqual('오전 5:00');
      expect((await runLocaleFunction(page, 'formatHour', '5:30'))).toEqual('오전 5:30');
      expect((await runLocaleFunction(page, 'formatHour', 10))).toEqual('오전 10:00');
      expect((await runLocaleFunction(page, 'formatHour', '10:30'))).toEqual('오전 10:30');
      expect((await runLocaleFunction(page, 'formatHour', 12))).toEqual('오후 12:00');
      expect((await runLocaleFunction(page, 'formatHour', '12:30'))).toEqual('오후 12:30');
      expect((await runLocaleFunction(page, 'formatHour', 15))).toEqual('오후 3:00');
      expect((await runLocaleFunction(page, 'formatHour', '15:30'))).toEqual('오후 3:30');
      expect((await runLocaleFunction(page, 'formatHour', 20))).toEqual('오후 8:00');
      expect((await runLocaleFunction(page, 'formatHour', '20:30'))).toEqual('오후 8:30');
      expect((await runLocaleFunction(page, 'formatHour', 24))).toEqual('오전 12:00');
      expect((await runLocaleFunction(page, 'formatHour', '24:30'))).toEqual('오전 12:30');
    });

    test('can format hours in zh-Hant', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'zh-Hant');

      expect((await runLocaleFunction(page, 'formatHour', 0))).toEqual('上午12:00');
      expect((await runLocaleFunction(page, 'formatHour', '0:30'))).toEqual('上午12:30');
      expect((await runLocaleFunction(page, 'formatHour', 5))).toEqual('上午5:00');
      expect((await runLocaleFunction(page, 'formatHour', '5:30'))).toEqual('上午5:30');
      expect((await runLocaleFunction(page, 'formatHour', 10))).toEqual('上午10:00');
      expect((await runLocaleFunction(page, 'formatHour', '10:30'))).toEqual('上午10:30');
      expect((await runLocaleFunction(page, 'formatHour', 12))).toEqual('下午12:00');
      expect((await runLocaleFunction(page, 'formatHour', '12:30'))).toEqual('下午12:30');
      expect((await runLocaleFunction(page, 'formatHour', 15))).toEqual('下午3:00');
      expect((await runLocaleFunction(page, 'formatHour', '15:30'))).toEqual('下午3:30');
      expect((await runLocaleFunction(page, 'formatHour', 20))).toEqual('下午8:00');
      expect((await runLocaleFunction(page, 'formatHour', '20:30'))).toEqual('下午8:30');
      expect((await runLocaleFunction(page, 'formatHour', 24))).toEqual('上午12:00');
      expect((await runLocaleFunction(page, 'formatHour', '24:30'))).toEqual('上午12:30');
    });
  });

  test.describe('hour range formatting tests', () => {
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can format hour range', async ({ page }) => {
      expect((await runLocaleFunction(page, 'formatHourRange', 5, 10))).toEqual('5 - 10:00 AM');
      expect((await runLocaleFunction(page, 'formatHourRange', 10, 12))).toEqual('10:00 AM - 12:00 PM');
      expect((await runLocaleFunction(page, 'formatHourRange', 10, 20))).toEqual('10:00 AM - 8:00 PM');
      expect((await runLocaleFunction(page, 'formatHourRange', 19, 20))).toEqual('7 - 8:00 PM');
      expect((await runLocaleFunction(page, 'formatHourRange', 12.5, 13))).toEqual('12:30 - 1:00 PM');
      expect((await runLocaleFunction(page, 'formatHourRange', 15.5, 17))).toEqual('3:30 - 5:00 PM');
      expect((await runLocaleFunction(page, 'formatHourRange', 20, 24))).toEqual('8:00 PM - 12:00 AM');

      await runLocaleFunction(page, 'setLocale', 'nl-NL');
      expect((await runLocaleFunction(page, 'formatHourRange', 0, 5))).toEqual('00:00 - 05:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 0.5, 5))).toEqual('00:30 - 05:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 0.25, 5))).toEqual('00:15 - 05:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 5, 10))).toEqual('05:00 - 10:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 10, 12))).toEqual('10:00 - 12:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 10, 20))).toEqual('10:00 - 20:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 19, 20))).toEqual('19:00 - 20:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 12.5, 13))).toEqual('12:30 - 13:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 15.5, 17))).toEqual('15:30 - 17:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 15.25, 17))).toEqual('15:15 - 17:00');
      expect((await runLocaleFunction(page, 'formatHourRange', 20, 24))).toEqual('20:00 - 00:00');
    });
  });

  test.describe('date parsing tests', () => {
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can parseDate with single digit format', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'parseDate', '18.10.2019 7.15', { dateFormat: 'd.M.yyyy H.mm' })).getTime())
        .toEqual((await pageDate.newDate(2019, 9, 18, 7, 15, 0)).getTime());
    });

    test('can have fallback for invalid time', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'parseDate', '1:00 AM', { dateFormat: 'h:mm a' })).getHours())
        .toEqual((await pageDate.newDate(2019, 9, 18, 1, 0, 0)).getHours());

      await page.evaluate(() => { ((window as any).utils as any).locale.calendar().timeFormat = null; });

      expect((await runLocaleFunction(page, 'parseDate', '1:00 AM', { dateFormat: 'h:mm a' })).getHours())
        .toEqual((await pageDate.newDate(2019, 9, 18, 1, 0, 0)).getHours());
    });

    test('can parseDate in el-GR', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'el-GR');

      expect((await runLocaleFunction(page, 'parseDate', '18/10/2019 7:15 π.μ.', { dateFormat: 'dd/MM/yyyy HH:mm a' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 7, 15, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18/10/2019 7:15 μ.μ.', { dateFormat: 'dd/MM/yyyy HH:mm a' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 19, 15, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18/10/2019 12:00 π.μ.', { dateFormat: 'dd/MM/yyyy HH:mm a' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18/10/2019 12:00 μ.μ.', { dateFormat: 'dd/MM/yyyy HH:mm a' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 12, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18/10/2019 11:59 π.μ.', { dateFormat: 'dd/MM/yyyy HH:mm a' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 11, 59, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18/10/2019 11:59 μ.μ.', { dateFormat: 'dd/MM/yyyy HH:mm a' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 23, 59, 0)).getTime());

      expect((await runLocaleFunction(page, 'parseDate', 'Απρίλιος', { dateFormat: 'MMMM' })).getMonth()).toEqual(3);
      expect((await runLocaleFunction(page, 'parseDate', 'Απρ', { dateFormat: 'MMM' })).getMonth()).toEqual(3);
    });

    test('can parseDate in fi-FI', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'fi-FI');

      expect((await runLocaleFunction(page, 'parseDate', '18.10.2019 7.15', { dateFormat: 'dd.MM.yyyy hh.mm' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 7, 15, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18.10.2019', { dateFormat: 'dd.MM.yyyy' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18.10.2019 7.15', { dateFormat: 'dd.MM.yyyy hh.mm' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 7, 15, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '18.10.2019', { dateFormat: 'dd.MM.yyyy' })).getTime()).toEqual((await pageDate.newDate(2019, 9, 18, 0, 0, 0)).getTime());

      expect((await runLocaleFunction(page, 'parseDate', 'Helmikuu', { dateFormat: 'MMMM' })).getMonth()).toEqual(1);
      expect((await runLocaleFunction(page, 'parseDate', 'helmi', { dateFormat: 'MMM' })).getMonth()).toEqual(1);
    });

    test('can parse dates with or without spaces, dash, and comma format', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'parseDate', '2014-12-11', { dateFormat: 'yyyy-MM-dd' })).getTime()).toEqual((await pageDate.newDate(2014, 11, 11, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '2014/12/11', { dateFormat: 'yyyy/MM/dd' })).getTime()).toEqual((await pageDate.newDate(2014, 11, 11, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '11122014', { dateFormat: 'dMyyyy' })).getTime()).toEqual((await pageDate.newDate(2014, 11, 11, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '12112014', { dateFormat: 'Mdyyyy' })).getTime()).toEqual((await pageDate.newDate(2014, 11, 11, 0, 0, 0)).getTime());
    });

    test('can parse AM/PM in Korean', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'ko-KR');

      expect((await runLocaleFunction(page, 'parseDate', '2020-02-26 오전 12:00', { dateFormat: 'yyyy-MM-dd a h:mm' })).getTime())
        .toEqual((await pageDate.newDate(2020, 1, 26, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '2020-02-26 오후 12:00', { dateFormat: 'yyyy-MM-dd a h:mm' })).getTime())
        .toEqual((await pageDate.newDate(2020, 1, 26, 12, 0, 0)).getTime());
    });

    test('can parse AM/PM in zh-TW', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'zh-TW');

      expect((await runLocaleFunction(page, 'parseDate', '2020/2/26 上午12:00', { dateFormat: 'yyyy/M/d ah:mm' })).getTime())
        .toEqual((await pageDate.newDate(2020, 1, 26, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '2020-02-26 下午12:00', { dateFormat: 'yyyy-M-d ah:mm' })).getTime())
        .toEqual((await pageDate.newDate(2020, 1, 26, 12, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '2020/3/4 下午9:00', { dateFormat: 'yyyy/M/d ah:mm' })).getTime())
        .toEqual((await pageDate.newDate(2020, 2, 4, 21, 0, 0)).getTime());
    });

    test('can parse date in non current locale', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'es-ES');
      await runLocaleFunction(page, 'setLocale', 'en-US');

      expect(await getLocaleValues(page, 'language.name')).toEqual('en');
      expect((await runLocaleFunction(page, 'parseDate', '2019-01-01', { dateFormat: 'yyyy-MM-dd', locale: 'es-ES' })).getTime())
        .toEqual((await pageDate.newDate(2019, 0, 1, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '20/10/2019 20:12', { dateFormat: 'dd/MM/yyyy HH:mm', locale: 'es-ES' })).getTime())
        .toEqual((await pageDate.newDate(2019, 9, 20, 20, 12, 0)).getTime());
    });

    test('can parse date in es-419', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'es-419');

      expect((await runLocaleFunction(page, 'parseDate', '29/4/2020 08:40', { dateFormat: 'd/M/yyyy HH:mm' })).getTime())
        .toEqual((await pageDate.newDate(2020, 3, 29, 8, 40, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '29 de abril de 2020', { pattern: 'd de MMMM de yyyy' })).getTime())
        .toEqual((await pageDate.newDate(2020, 3, 29, 0, 0, 0)).getTime());
    });

    test('can parse date in ar-SA', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      const dateTest = await runLocaleFunction(page, 'parseDate', '1441/09/05 9:30 ص', { locale: 'ar-SA', pattern: 'yyyy/MM/dd h:mm a' });

      expect(dateTest[0]).toEqual(1441);
      expect(dateTest[1]).toEqual(8);
      expect(dateTest[2]).toEqual(5);
      expect(dateTest[3]).toEqual(9);
      expect(dateTest[4]).toEqual(30);
      expect(dateTest[5]).toEqual(0);
    });

    test('can parse date in ar-SA with no time', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      const dateTest = await runLocaleFunction(page, 'parseDate', '1442/09/05', { locale: 'ar-SA', pattern: 'yyyy/MM/dd' });

      expect(dateTest[0]).toEqual(1442);
      expect(dateTest[1]).toEqual(8);
      expect(dateTest[2]).toEqual(5);
      expect(dateTest[3]).toEqual(0);
      expect(dateTest[4]).toEqual(0);
      expect(dateTest[5]).toEqual(0);
    });

    test('can parse date in hr-HR', async ({ page, pageDate }) => {
      await runLocaleFunction(page, 'setLocale', 'hr-HR');

      expect((await runLocaleFunction(page, 'parseDate', '01. 11. 2018. 05:25', { pattern: 'dd. MM. y. HH:mm' })).getTime())
        .toEqual((await pageDate.newDate(2018, 10, 1, 5, 25, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '01. 11. 2018. 17:25', { pattern: 'dd. MM. y. HH:mm' })).getTime())
        .toEqual((await pageDate.newDate(2018, 10, 1, 17, 25, 0)).getTime());
    });

    test('can parse dates', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'parseDate', '11/8/2000')).getTime()).toEqual((await pageDate.newDate(2000, 10, 8)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '11/8/00')).getTime()).toEqual((await pageDate.newDate(2000, 10, 8)).getTime());

      await runLocaleFunction(page, 'setLocale', 'de-DE');
      expect((await runLocaleFunction(page, 'parseDate', '08.11.2000')).getTime()).toEqual((await pageDate.newDate(2000, 10, 8)).getTime());
    });

    test('can parse dates with month zero', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'parseDate', '2016-01-01', { dateFormat: 'yyyy-MM-dd' })).getTime()).toEqual((await pageDate.newDate(2016, 0, 1)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '2016-01-03', { dateFormat: 'yyyy-MM-dd' })).getTime()).toEqual((await pageDate.newDate(2016, 0, 3)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '2016-01-31', { dateFormat: 'yyyy-MM-dd' })).getTime()).toEqual((await pageDate.newDate(2016, 0, 31)).getTime());
    });

    test('can parse dates with dashes', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'parseDate', '2015-05-10', { dateFormat: 'yyyy-dd-MM' })).getTime()).toEqual((await pageDate.newDate(2015, 9, 5, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '05-10-2015', { dateFormat: 'dd-MM-yyyy' })).getTime()).toEqual((await pageDate.newDate(2015, 9, 5, 0, 0, 0)).getTime());
    });

    test('can parse ISO dates with dashes', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseDate', '2011-10-05T14:48:00.000Z')).getTime()).toEqual(1317826080000);
    });

    test('can parse single months, days, years and their combinations', async ({ page, pageDate }) => {
      expect((await runLocaleFunction(page, 'parseDate', 'June', 'MMMM')).getMonth()).toEqual(5);
      expect((await runLocaleFunction(page, 'parseDate', 'Jun', 'MMM')).getMonth()).toEqual(5);
      expect((await runLocaleFunction(page, 'parseDate', '2020', 'yyyy')).getFullYear()).toEqual(2020);
      expect((await runLocaleFunction(page, 'parseDate', 'June 2020', 'MMMM yyyy')).getTime()).toEqual((await pageDate.newDate(2020, 5, 1, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', 'June 20', 'MMMM dd')).getMonth()).toEqual(5);
      expect((await runLocaleFunction(page, 'parseDate', 'June 03', 'MMMM dd')).getDate()).toEqual(3);
      expect((await runLocaleFunction(page, 'parseDate', 'June 20', 'MMMM d')).getDate()).toEqual(20);
      expect((await runLocaleFunction(page, 'parseDate', '2020 June', 'yyyy MMMM')).getTime()).toEqual((await pageDate.newDate(2020, 5, 1, 0, 0, 0)).getTime());
      expect((await runLocaleFunction(page, 'parseDate', '02', 'dd')).getDate()).toEqual(2);
    });

    test('can stricly parse time', async ({ page }) => {
      expect((await runLocaleFunction(page, 'parseDate', '14:77 AM', { dateFormat: 'hh:mm a', strictTime: true }))).not.toBeDefined();
      expect((await runLocaleFunction(page, 'parseDate', '13:77 AM', { dateFormat: 'h:mm a', strictTime: true }))).not.toBeDefined();
      expect((await runLocaleFunction(page, 'parseDate', '29:33:99', { dateFormat: 'HH:mm:ss', strictTime: true }))).not.toBeDefined();
      expect((await runLocaleFunction(page, 'parseDate', '29:33:99', { dateFormat: 'H:mm:ss', strictTime: true }))).not.toBeDefined();
      expect((await runLocaleFunction(page, 'parseDate', '2:15 test', { dateFormat: 'h:mm a', strictTime: true }))).not.toBeDefined();
      expect((await runLocaleFunction(page, 'parseDate', '2:', { dateFormat: 'h:mm a', strictTime: true }))).not.toBeDefined();
      expect((await runLocaleFunction(page, 'parseDate', '2', { dateFormat: 'h:mm a', strictTime: true }))).not.toBeDefined();

      expect((await runLocaleFunction(page, 'parseDate', '11:77:99', { dateFormat: 'H:mm:ss' })).getSeconds()).toEqual(0);
      expect((await runLocaleFunction(page, 'parseDate', '11:77:99', { dateFormat: 'H:mm:ss' })).getMinutes()).toEqual(0);
    });
  });

  test.describe('Arabic/Islamic calendar tests', () => {
    test.beforeEach(async ({ pageErrorsTest }) => {
      pageErrorsTest.clearErrors();
    });

    test.afterEach(async ({ pageErrorsTest }) => {
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can support checking of Islamic calendar', async ({ page }) => {
      expect((await runLocaleFunction(page, 'isIslamic', ''))).toEqual(false);

      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      expect((await runLocaleFunction(page, 'isIslamic', ''))).toEqual(true);

      await runLocaleFunction(page, 'setLocale', 'es-ES');
      expect((await runLocaleFunction(page, 'isIslamic', ''))).toEqual(false);

      expect((await runLocaleFunction(page, 'isIslamic', 'ar-SA'))).toEqual(true);
      expect((await runLocaleFunction(page, 'isIslamic', 'xx-XX'))).toEqual(false);
    });

    test('can support checking of RTL', async ({ page }) => {
      expect((await runLocaleFunction(page, 'isRTL', ''))).toEqual(false);

      await runLocaleFunction(page, 'setLocale', 'ar-SA');
      expect((await runLocaleFunction(page, 'isRTL', ''))).toEqual(true);

      expect((await runLocaleFunction(page, 'isRTL', 'en-US'))).toEqual(false);
      expect((await runLocaleFunction(page, 'isRTL', 'en'))).toEqual(false);

      expect((await runLocaleFunction(page, 'isRTL', 'ar-SA'))).toEqual(true);
      expect((await runLocaleFunction(page, 'isRTL', 'ar'))).toEqual(true);
    });
  });
});
