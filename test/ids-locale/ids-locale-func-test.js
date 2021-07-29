/**
 * @jest-environment jsdom
 */
import IdsLocale from '../../src/ids-locale/ids-locale';
import IdsContainer from '../../src/ids-container/ids-container';

describe('IdsLocale API', () => {
  let locale;

  beforeEach(async () => {
    locale = new IdsLocale();
    locale.language = 'en';
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  describe('General Setup', () => {
    it('should be possible to set locale', async () => {
      await locale.setLocale('en-US');
      expect(locale.locale.name).toEqual('en-US');
      expect(locale.locale.options.englishName).toEqual('English (United States)');
      expect(Object.keys(locale.language.messages).length).toBeGreaterThan(1);
      expect(locale.language.name).toEqual('en');
      expect(locale.formatDate(new Date(2019, 11, 4))).toEqual('12/4/2019');
      expect(locale.locale.options.calendars[0].dateFormat.short).toEqual('M/d/yyyy');

      await locale.setLocale('de-DE');
      expect(locale.locale.name).toEqual('de-DE');
      expect(locale.locale.options.englishName).toEqual('German (Germany)');
      expect(Object.keys(locale.language.messages).length).toBeGreaterThan(1);
      expect(locale.language.name).toEqual('de');
      expect(locale.formatDate(new Date(2019, 11, 4))).toEqual('4.12.2019');
      expect(locale.locale.options.calendars[0].dateFormat.short).toEqual('dd.MM.yyyy');
    });

    it('handles setting the locale with the setter', () => {
      locale = new IdsLocale();
      locale.locale = 'de-DE';
      expect(locale.locale.name).toEqual('de-DE');
      locale.locale = '';
      expect(locale.locale.name).toEqual('de-DE');
    });

    it('handles null/undefined locale in setLocale', async () => {
      await locale.setLocale(null);
      expect(locale.locale.name).toEqual('en-US');
      await locale.setLocale(undefined);
      expect(locale.locale.name).toEqual('en-US');
      await locale.setLocale('');
      expect(locale.locale.name).toEqual('en-US');
    });

    it('renders with no errors', () => {
      const errors = jest.spyOn(global.console, 'error');
      locale = new IdsLocale();
      expect(errors).not.toHaveBeenCalled();
    });

    it('can load all available message files', async () => {
      const errors = jest.spyOn(global.console, 'error');
      await locale.setLanguage('af');
      await locale.setLanguage('ar');
      await locale.setLanguage('bg');
      await locale.setLanguage('cs');
      await locale.setLanguage('da');
      await locale.setLanguage('de');
      await locale.setLanguage('el');
      await locale.setLanguage('en');
      await locale.setLanguage('es');
      await locale.setLanguage('et');
      await locale.setLanguage('fi');
      await locale.setLanguage('fr-CA');
      await locale.setLanguage('fr-FR');
      await locale.setLanguage('fr');
      await locale.setLanguage('he');
      await locale.setLanguage('hi');
      await locale.setLanguage('hr');
      await locale.setLanguage('hu');
      await locale.setLanguage('id');
      await locale.setLanguage('it');
      await locale.setLanguage('ja');
      await locale.setLanguage('ko');
      await locale.setLanguage('lt');
      await locale.setLanguage('lv');
      await locale.setLanguage('ms');
      await locale.setLanguage('nb');
      await locale.setLanguage('nl');
      await locale.setLanguage('nn');
      await locale.setLanguage('no');
      await locale.setLanguage('pl');
      await locale.setLanguage('pt-BR');
      await locale.setLanguage('pt-PT');
      await locale.setLanguage('pt');
      await locale.setLanguage('ro');
      await locale.setLanguage('ru');
      await locale.setLanguage('sk');
      await locale.setLanguage('sl');
      await locale.setLanguage('sv');
      await locale.setLanguage('th');
      await locale.setLanguage('tr');
      await locale.setLanguage('uk');
      await locale.setLanguage('vi');
      await locale.setLanguage('zh-CN');
      await locale.setLanguage('zh-Hans');
      await locale.setLanguage('zh-TW');
      await locale.setLanguage('zh');
      expect(errors).not.toHaveBeenCalled();
    });

    it('can load all available locale files', async () => {
      const errors = jest.spyOn(global.console, 'error');
      await locale.setLocale('af-ZA');
      await locale.setLocale('ar-EG');
      await locale.setLocale('ar-SA');
      await locale.setLocale('bg-BG');
      await locale.setLocale('cs-CZ');
      await locale.setLocale('da-DK');
      await locale.setLocale('de-DE');
      await locale.setLocale('el-GR');
      await locale.setLocale('en-AU');
      await locale.setLocale('en-GB');
      await locale.setLocale('en-IN');
      await locale.setLocale('en-NZ');
      await locale.setLocale('en-US');
      await locale.setLocale('en-ZA');
      await locale.setLocale('es-419');
      await locale.setLocale('es-AR');
      await locale.setLocale('es-ES');
      await locale.setLocale('es-MX');
      await locale.setLocale('es-US');
      await locale.setLocale('et-EE');
      await locale.setLocale('fi-FI');
      await locale.setLocale('fr-CA');
      await locale.setLocale('fr-FR');
      await locale.setLocale('he-IL');
      await locale.setLocale('hi-IN');
      await locale.setLocale('hr-HR');
      await locale.setLocale('hu-HU');
      await locale.setLocale('id-ID');
      await locale.setLocale('it-IT');
      await locale.setLocale('ja-JP');
      await locale.setLocale('ko-KR');
      await locale.setLocale('lt-LT');
      await locale.setLocale('lv-LV');
      await locale.setLocale('ms-bn');
      await locale.setLocale('ms-my');
      await locale.setLocale('nb-NO');
      await locale.setLocale('nl-NL');
      await locale.setLocale('nn-NO');
      await locale.setLocale('no-NO');
      await locale.setLocale('pl-PL');
      await locale.setLocale('pt-BR');
      await locale.setLocale('pt-PT');
      await locale.setLocale('ro-RO');
      await locale.setLocale('ru-RU');
      await locale.setLocale('sk-SK');
      await locale.setLocale('sl-SI');
      await locale.setLocale('sv-SE');
      await locale.setLocale('th-TH');
      await locale.setLocale('tr-TR');
      await locale.setLocale('uk-UA');
      await locale.setLocale('vi-VN');
      await locale.setLocale('zh-CN');
      await locale.setLocale('zh-Hans');
      await locale.setLocale('zh-Hant');
      await locale.setLocale('zh-TW');
      expect(errors).not.toHaveBeenCalled();
    });

    it('should be possible to set the language to nb', async () => {
      await locale.setLocale('en-US');

      expect(locale.translate('Actions')).toEqual('Actions');
      expect(locale.language.name).toEqual('en');

      await locale.setLanguage('nb');
      expect(locale.translate('Actions')).toEqual('Handlinger');
      expect(locale.language.name).toEqual('nb');
    });

    it('should be possible to set the language to nn', async () => {
      await locale.setLocale('en-US');

      expect(locale.translate('Actions')).toEqual('Actions');
      expect(locale.language.name).toEqual('en');

      await locale.setLanguage('nn');
      expect(locale.translate('Actions')).toEqual('Handlinger');
      expect(locale.language.name).toEqual('nn');
    });

    it('should show in the current language when language is not loaded', async () => {
      await locale.setLanguage('fi');
      expect(locale.translate('Actions', { language: 'de' })).toEqual('Toiminnot');
    });

    it('renders correctly', () => {
      expect(locale).toBeTruthy();
      expect(locale.translate).toBeTruthy();
    });

    it('is set correctly', () => {
      expect(locale).toBeTruthy();
      expect(locale.translate).toBeTruthy();
    });

    it('can set langauge with a setter', async () => {
      locale.language = 'no';

      expect(locale.language.name).toEqual('no');
    });

    it('should map in and iw', async () => {
      await locale.setLanguage('in-ID');
      expect(locale.language.name).toEqual('id');

      await locale.setLanguage('iw');
      expect(locale.language.name).toEqual('he');
    });

    it('should map in and iw locales', async () => {
      await locale.setLocale('in-ID');
      expect(locale.locale.name).toEqual('id-ID');

      await locale.setLocale('iw');
      expect(locale.locale.name).toEqual('he-IL');
    });

    it('should contain time data', async () => {
      await locale.setLocale('af-ZA');
      expect(locale.calendar().timeFormat).toEqual('HH:mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('yyyy-MM-dd HH:mm');

      await locale.setLocale('bg-BG');
      expect(locale.calendar().timeFormat).toEqual('H:mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('H:mm:ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('d.MM.yyyy H:mm');

      await locale.setLocale('cs-CZ');
      expect(locale.calendar().timeFormat).toEqual('H:mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('H:mm:ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('dd.MM.yyyy H:mm');

      await locale.setLocale('da-DK');
      expect(locale.calendar().timeFormat).toEqual('HH.mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('HH.mm.ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('dd-MM-yyyy HH.mm');

      await locale.setLocale('de-DE');
      expect(locale.calendar().timeFormat).toEqual('HH:mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('dd.MM.yyyy HH:mm');

      await locale.setLocale('el-GR');
      expect(locale.calendar().timeFormat).toEqual('h:mm a');
      expect(locale.calendar().dateFormat.timestamp).toEqual('h:mm:ss a');
      expect(locale.calendar().dateFormat.datetime).toEqual('d/M/yyyy h:mm a');

      await locale.setLocale('pl-PL');
      expect(locale.calendar().timeFormat).toEqual('HH:mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('dd.MM.yyyy HH:mm');

      await locale.setLocale('pt-BR');
      expect(locale.calendar().timeFormat).toEqual('HH:mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('dd/MM/yyyy HH:mm');

      await locale.setLocale('sl-SI');
      expect(locale.calendar().timeFormat).toEqual('HH:mm');
      expect(locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
      expect(locale.calendar().dateFormat.datetime).toEqual('d. MM. yyyy HH:mm');
    });
  });

  describe('Translations', () => {
    it('should support translation', async () => {
      await locale.setLanguage('en');
      expect(locale.translate('Required')).toEqual('Required');

      // With full language selector
      await locale.setLanguage('de-DE');
      expect(locale.translate('Required')).toEqual('Erforderlich');
      expect(locale.translate('Loading')).toEqual('Laden...');
      expect(locale.translate('Filter')).toEqual('Filtern');

      // Error / missing
      expect(locale.translate('XYZ')).toEqual('[XYZ]');

      // Non Existant in locale so uses EN
      await locale.setLanguage('de-DE');
      expect(locale.translate('Equals')).toEqual('Gleich');

      // Afrikaans
      await locale.setLanguage('af-ZA');
      expect(locale.translate('Equals')).toEqual('Gelyk aan');

      // Error
      expect(locale.translate('XYZ')).toEqual('[XYZ]');
    });

    it('should be able get translations in a non current locale  (fi-FI)', async () => {
      await locale.setLanguage('de');
      await locale.setLanguage('fi');
      await locale.setLanguage('sv');

      expect(locale.translate('Required')).toEqual('Obligatoriskt');
      expect(locale.translate('Required', { language: 'de' })).toEqual('Erforderlich');
      expect(locale.translate('Required', { language: 'sv' })).toEqual('Obligatoriskt');
    });

    it('should be able get translations in a non current locale (de-DE)', async () => {
      await locale.setLanguage('de');
      await locale.setLocale('en-US');
      await locale.setLanguage('en');

      expect(locale.locale.name).toEqual('en-US');
      expect(locale.language.name).toEqual('en');
      expect(locale.translate('Required')).toEqual('Required');
      expect(locale.translate('Loading')).toEqual('Loading');
      expect(locale.translate('Required', { language: 'de' })).toEqual('Erforderlich');
      expect(locale.translate('Loading', { language: 'de' })).toEqual('Laden...');
    });

    it('should translations as undefined if not found', async () => {
      await locale.setLocale('en-US');

      expect(locale.translate('XYZ', { showAsUndefined: true })).toEqual(undefined);
      expect(locale.translate('XYZ', { showAsUndefined: false })).toEqual('[XYZ]');
      expect(locale.translate('XYZ', { showAsUndefined: true })).toEqual(undefined);
      expect(locale.translate('XYZ', { showAsUndefined: false })).toEqual('[XYZ]');
      // Show brackets setting
      expect(locale.translate('XYZ', { showAsUndefined: true, showBrackets: true })).toEqual(undefined);
      expect(locale.translate('XYZ', { showAsUndefined: false, showBrackets: true })).toEqual('[XYZ]');
      expect(locale.translate('XYZ', { showAsUndefined: true, showBrackets: false })).toEqual(undefined);
      expect(locale.translate('XYZ', { showAsUndefined: false, showBrackets: false })).toEqual('XYZ');
      expect(locale.translate('XYZ', { showBrackets: true })).toEqual('[XYZ]');
      expect(locale.translate('XYZ', { showBrackets: false })).toEqual('XYZ');
    });

    it('should show undefined keys with [] around them', async () => {
      await locale.setLanguage('en-US');

      expect(locale.translate('TestLocaleDefaults')).toEqual('Test Locale Defaults');
      await locale.setLanguage('de-DE');

      expect(locale.translate('TestLocaleDefaults')).toEqual('Test Locale Defaults');
      await locale.setLanguage('ar-EG');

      expect(locale.translate('XYZ')).toEqual('[XYZ]');
    });

    it('should be able to set language to full code', async () => {
      await locale.setLocale('en-US');
      await locale.setLanguage('fr-CA');

      expect(locale.locale.name).toEqual('en-US');
      expect(locale.language.name).toEqual('fr-CA');
      expect(locale.translate('AddComments')).toEqual('Ajouter des commentaires');
      expect(locale.translate('ReorderRows')).toEqual('Réorganiser les lignes');
      expect(locale.translate('SelectDay')).toEqual('Sélectionner un jour');
      expect(locale.translate('UserProfile')).toEqual('Profil utilisateur');

      await locale.setLanguage('de-DE');
      expect(locale.locale.name).toEqual('en-US');
      expect(locale.translate('AddComments')).toEqual('Anmerkungen hinzufügen');
      expect(locale.translate('ReorderRows')).toEqual('Zeilen neu anordnen');
      expect(locale.translate('SelectDay')).toEqual('Tag auswählen');
      expect(locale.translate('UserProfile')).toEqual('Benutzerprofil');
    });

    it('should provide a different fr-CA and fr-FR', async () => {
      await locale.setLocale('fr-FR');
      expect(locale.locale.name).toEqual('fr-FR');
      expect(locale.language.name).toEqual('fr-FR');
      expect(locale.translate('From')).toEqual('Début');

      await locale.setLocale('fr-CA');
      expect(locale.language.name).toEqual('fr-CA');
      expect(locale.language.name).toEqual('fr-CA');
      expect(locale.translate('From')).toEqual('De');
    });

    it('should Get the Parent Locale', async () => {
      await locale.setLocale('es-MX');
      expect(locale.locale.name).toEqual('es-MX');
      expect(locale.language.name).toEqual('es');
      expect(locale.translate('Required')).toEqual('Obligatorio');

      await locale.setLocale('es-419');
      expect(locale.locale.name).toEqual('es-419');
      expect(locale.language.name).toEqual('es');
      expect(locale.translate('Required')).toEqual('Obligatorio');

      await locale.setLocale('nb-NO');
      expect(locale.locale.name).toEqual('nb-NO');
      expect(locale.language.name).toEqual('nb');
      expect(locale.translate('Required')).toEqual('Obligatorisk');

      await locale.setLocale('no-NO');
      expect(locale.locale.name).toEqual('no-NO');
      expect(locale.language.name).toEqual('no');
      expect(locale.translate('Required')).toEqual('Obligatorisk');
    });

    it('should be possible to add translations', async () => {
      await locale.setLocale('en-US');
      locale.language.messages.CustomValue = { id: 'CustomValue', value: 'Added Custom Value' };

      expect(locale.translate('CollapseAppTray')).toEqual('Collapse App Tray');
      expect(locale.translate('CustomValue')).toEqual('Added Custom Value');
    });

    it('should be able to set language to full code from a similar language', async () => {
      await locale.setLocale('fr-FR');
      await locale.setLanguage('fr-CA');

      expect(locale.locale.name).toEqual('fr-FR');
      expect(locale.language.name).toEqual('fr-CA');

      expect(locale.translate('AddComments')).toEqual('Ajouter des commentaires');
      expect(locale.translate('ReorderRows')).toEqual('Réorganiser les lignes');
      expect(locale.translate('SelectDay')).toEqual('Sélectionner un jour');
      expect(locale.translate('UserProfile')).toEqual('Profil utilisateur');
    });

    it('should treat no-NO and and nn-NO nb-NO as the same locale', async () => {
      await locale.setLanguage('no');
      expect(locale.translate('Loading')).toEqual('Laster');

      await locale.setLanguage('nb');
      expect(locale.translate('Loading')).toEqual('Laster');

      await locale.setLanguage('nn');
      expect(locale.translate('Loading')).toEqual('Laster');
    });

    it('should be possible to add translations', async () => {
      await locale.setLanguage('it');
      const myStrings = {
        Thanks: { id: 'Thanks', value: 'Grazie', comment: '' },
        YourWelcome: { id: 'YourWelcome', value: 'Prego', comment: '' }
      };
      locale.extendTranslations(locale.language.name, myStrings);

      expect(locale.translate('Comments')).toEqual('Commenti');
      expect(locale.translate('Thanks')).toEqual('Grazie');
      expect(locale.translate('YourWelcome')).toEqual('Prego');
    });

    it('should not be possible to add translations for a non existant language', async () => {
      const myStrings = {
        Thanks: { id: 'Thanks', value: 'Grazie', comment: '' }
      };
      locale.extendTranslations('ff', myStrings);

      expect(locale.translate('Thanks')).toEqual('[Thanks]');
    });

    it('should not translate &nsbp;', () => {
      expect(locale.translate('&nsbp;')).toEqual('');
    });

    it('should be possible to set the language to nb', async () => {
      await locale.setLanguage('en-US');

      expect(locale.translate('Actions')).toEqual('Actions');
      expect(locale.language.name).toEqual('en');

      await locale.setLanguage('nb');
      expect(locale.translate('Actions')).toEqual('Handlinger');
      expect(locale.language.name).toEqual('nb');
    });

    it('should show brackets on undefined strings', async () => {
      expect(locale.translate('SomeTextThatDoesntExist')).toEqual('[SomeTextThatDoesntExist]');
    });

    it('should translations in [] if not found', () => {
      expect(locale.translate('XYZ', { showBrackets: true })).toEqual('[XYZ]');
      expect(locale.translate('XYZ', { showBrackets: false })).toEqual('XYZ');
    });

    it('should translate in the root locale', async () => {
      await locale.setLanguage('es-MX');

      expect(locale.language.name).toEqual('es');
      expect(locale.translate('Required')).toEqual('Obligatorio');

      await locale.setLanguage('es-419');

      expect(locale.language.name).toEqual('es');
      expect(locale.translate('Required')).toEqual('Obligatorio');

      await locale.setLanguage('nb-NO');

      expect(locale.language.name).toEqual('nb');
      expect(locale.translate('Required')).toEqual('Obligatorisk');

      await locale.setLanguage('no-NO');

      expect(locale.language.name).toEqual('no');
      expect(locale.translate('Required')).toEqual('Obligatorisk');
    });

    it('should correct missing languages to english', async () => {
      const myStrings = {
        ExtraX: { id: 'ExtraX', value: 'ExtraX', comment: '' }
      };
      locale.extendTranslations(locale.language.name, myStrings);
      await locale.setLanguage('th-TH');
      expect(locale.translate('ExtraX')).toEqual('ExtraX');
    });

    it('should correct placeholder missing translations', async () => {
      await locale.setLanguage('th-TH');

      expect(locale.translate('Locale')).toEqual('ตำแหน่งที่ตั้ง');
      await locale.setLanguage('fr-FR');

      expect(locale.translate('SetTime')).toEqual('Fixer l\'heure');
      await locale.setLanguage('fr-CA');

      expect(locale.translate('SetTime')).toEqual('Fixer l\'heure');
      await locale.setLanguage('el-GR');

      expect(locale.translate('Blockquote')).toEqual('Αποκλεισμός προσφοράς');
      expect(locale.translate('ViewSource')).toEqual('Προβολή πηγής');
      await locale.setLanguage('lt-LT');

      expect(locale.translate('CssClass')).toEqual('Css Klasė');

      await locale.setLanguage('zh-CN');

      expect(locale.translate('StrikeThrough')).toEqual('穿透');
      expect(locale.translate('InsertAnchor')).toEqual('插入定位标记');
    });

    it('should support fr-CA', async () => {
      await locale.setLocale('en-US');
      await locale.setLanguage('fr-CA');
      expect(locale.translate('AddComments')).toEqual('Ajouter des commentaires');

      await locale.setLanguage('fr-FR');
      expect(locale.translate('AddComments')).toEqual('Ajouter commentaires');

      await locale.setLanguage('fr-CA');
      expect(locale.translate('AddComments')).toEqual('Ajouter des commentaires');

      await locale.setLanguage('fr-FR');
      expect(locale.translate('AddComments')).toEqual('Ajouter commentaires');
    });

    it('should properly convert character cases in some specific Locales', async () => {
      await locale.setLocale('tr-TR');
      expect('kodları'.toLocaleUpperCase()).toEqual('KODLARI');
      expect('İSTANBUL'.toLocaleLowerCase()).toEqual('i̇stanbul');
    });

    it('should treat no-NO and nb-NO as the same locale', async () => {
      await locale.setLocale('no-NO');
      expect(locale.translate('Loading')).toEqual('Laster');

      await locale.setLocale('nb-NO');
      expect(locale.translate('Loading')).toEqual('Laster');
      expect(locale.calendar().timeFormat).toEqual('HH:mm');
    });
  });

  describe('Number Formatting', () => {
    it('should convert arabic numbers', async () => {
      expect(locale.convertNumberToEnglish('١٢٣٤٥٦٧٨٩٠')).toEqual(1234567890);
      expect(locale.convertNumberToEnglish('١٢٣')).toEqual(123);
      expect(locale.convertNumberToEnglish('١٢٣.٤٥')).toEqual(123.45);
      expect(locale.convertNumberToEnglish('١٬٢٣٤٬٥٦٧٬٨٩٠')).toEqual(1234567890);
    });

    it('should convert hebrew numbers', async () => {
      expect(locale.convertNumberToEnglish('१२३४५६७८९०')).toEqual(1234567890);
      expect(locale.convertNumberToEnglish('१२३')).toEqual(123);
      expect(locale.convertNumberToEnglish('१२३.४५')).toEqual(123.45);
      expect(locale.convertNumberToEnglish('१,२३४,५६७,८९०')).toEqual(1234567890);
    });

    it('should convert chinese financial traditional numbers', async () => {
      expect(locale.convertNumberToEnglish('壹貳叄肆伍陸柒捌玖零')).toEqual(1234567890);
      expect(locale.convertNumberToEnglish('貳零壹玖')).toEqual(2019);
      expect(locale.convertNumberToEnglish('壹貳叄.肆伍')).toEqual(123.45);
      expect(locale.convertNumberToEnglish('壹,貳叄肆,伍陸柒,捌玖零')).toEqual(1234567890);
    });

    it('should convert chinese financial simplified numbers', async () => {
      expect(locale.convertNumberToEnglish('壹贰叁肆伍陆柒捌玖零')).toEqual(1234567890);
      expect(locale.convertNumberToEnglish('贰零壹玖')).toEqual(2019);
      expect(locale.convertNumberToEnglish('壹贰叁.肆伍')).toEqual(123.45);
      expect(locale.convertNumberToEnglish('壹,贰叁肆,伍陆柒,捌玖零')).toEqual(1234567890);
    });

    it('should convert chinese normal numbers', async () => {
      expect(locale.convertNumberToEnglish('一二三四五六七八九零')).toEqual(1234567890);
      expect(locale.convertNumberToEnglish('二零一九')).toEqual(2019);
      expect(locale.convertNumberToEnglish('二〇一九')).toEqual(2019);
      expect(locale.convertNumberToEnglish('一二三.四五')).toEqual(123.45);
      expect(locale.convertNumberToEnglish('一,二三四,五六七,八九零')).toEqual(1234567890);
    });

    it('supports unicode', async () => {
      expect(locale.formatNumber(2019, { locale: 'ar-SA' })).toEqual('٢٬٠١٩٫٠٠');
      expect(locale.formatNumber(2019, { locale: 'zh-Hans-CN-u-nu-hanidec' })).toEqual('二,〇一九.〇〇');
    });

    it('should format numbers and handle exceptions', () => {
      expect(locale.formatNumber(undefined, { date: 'timestamp' })).toEqual('NaN');
    });

    it('should format big numbers', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber('123456789012.123456', {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      })).toEqual('123,456,789,012.123456');

      expect(locale.formatNumber(parseFloat('123456789012.123456'), {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      })).toEqual('123,456,789,012.123460');

      expect(locale.formatNumber('-922589489099.38', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        group: '',
        decimal: '.'
      })).toEqual('-922589489099.38');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber('12345678901222121.123456', {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      })).toEqual('12.345.678.901.222.121,123456');
    });

    it('should format integer numbers', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber('123456', {
        style: 'integer'
      })).toEqual('123,456');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber('123456', {
        style: 'integer'
      })).toEqual('123.456');
    });

    it('should handle minimumFractionDigits', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber('12345', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345');
      expect(locale.formatNumber('12345.1', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.1');
      expect(locale.formatNumber('12345.12', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.12');
      expect(locale.formatNumber('12345.123', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.12');
      expect(locale.formatNumber('12345.1234', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.12');
      expect(locale.formatNumber('12345', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.00');
      expect(locale.formatNumber('12345.1', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.10');
      expect(locale.formatNumber('12345.12', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.12');
      expect(locale.formatNumber('12345.123', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.123');
      expect(locale.formatNumber('12345.12345678', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.1235');

      // Leave out the maximumFractionDigits
      expect(locale.formatNumber('12345', { minimumFractionDigits: 2 })).toEqual('12,345.00');
      expect(locale.formatNumber('12345', { minimumFractionDigits: 0 })).toEqual('12,345');
      expect(locale.formatNumber('12345.1', { minimumFractionDigits: 0 })).toEqual('12,345.1');
      expect(locale.formatNumber('12345', { minimumFractionDigits: 4 })).toEqual('12,345.0000');
      expect(locale.formatNumber('12345.1', { minimumFractionDigits: 5 })).toEqual('12,345.10000');
    });

    it('should format negative numbers', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber(-1000000, { style: 'currency', currency: 'USD' })).toEqual('-$1,000,000.00');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber(-1000000, { style: 'currency', currency: 'EUR' })).toEqual('-1.000.000,00 €');
    });

    it('should be able to format a number in a non current locale', async () => {
      await locale.setLocale('nl-NL');
      await locale.setLocale('hi-IN');
      await locale.setLocale('en-US');

      expect(locale.language.name).toEqual('en');
      expect(locale.formatNumber(123456789.1234, { locale: 'en-US' })).toEqual('123,456,789.123');
      expect(locale.formatNumber(123456789.1234)).toEqual('123,456,789.123');
      expect(locale.formatNumber(123456789.1234, { locale: 'nl-NL' })).toEqual('123.456.789,123');
      expect(locale.formatNumber(123456789.1234, { locale: 'en-US' })).toEqual('123,456,789.123');
      expect(locale.formatNumber(123456789.1234)).toEqual('123,456,789.123');
      expect(locale.formatNumber(123456789.1234, { locale: 'hi-IN' })).toEqual('12,34,56,789.123');
      expect(locale.locale.name).toEqual('en-US');
    });

    it('should format decimals', async () => {
      await locale.setLocale('en-US');

      expect(locale.formatNumber(145000)).toEqual('145,000.00');
      expect(locale.formatNumber(283423)).toEqual('283,423.00');
      expect(locale.formatNumber(12345.1234)).toEqual('12,345.123');
      expect(locale.formatNumber(12345.123, { style: 'decimal', maximumFractionDigits: 2 })).toEqual('12,345.12');
      expect(locale.formatNumber(12345.123456, { style: 'decimal', maximumFractionDigits: 3 })).toEqual('12,345.123');
      expect(locale.formatNumber(0.0000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0.0000004');
      expect(locale.formatNumber(20.1, { style: 'decimal', round: true, minimumFractionDigits: 2 })).toEqual('20.10');
      expect(locale.formatNumber(20.1, { style: 'decimal', round: true })).toEqual('20.10');
      expect(locale.formatNumber('12,345.123')).toEqual('12,345.123');
      expect(locale.formatNumber(12345.1234, { group: '' })).toEqual('12345.123');
      expect(locale.formatNumber(5.1, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('5.10');
      expect(locale.formatNumber(145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 })).toEqual('145,000.00000');

      await locale.setLocale('de-DE');

      expect(locale.formatNumber(145000)).toEqual('145.000,00');
      expect(locale.formatNumber(283423)).toEqual('283.423,00');
      expect(locale.formatNumber(12345.1)).toEqual('12.345,10');
      expect(locale.formatNumber(0.0000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0,0000004');
      expect(locale.formatNumber(0.000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0,000004');
      expect(locale.formatNumber(145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 })).toEqual('145.000,00000');

      await locale.setLocale('ar-EG');

      expect(locale.formatNumber(12345.1)).toEqual('١٢٬٣٤٥٫١٠');
      await locale.setLocale('bg-BG');

      expect(locale.formatNumber(12345.1)).toEqual('12 345,10');
    });

    it('should round decimals', async () => {
      await locale.setLocale('en-US');

      expect(locale.formatNumber(123456.123456, { style: 'decimal', maximumFractionDigits: 5 })).toEqual('123,456.12346');
      expect(locale.formatNumber(123456.123456, { style: 'decimal', maximumFractionDigits: 4 })).toEqual('123,456.1235');
      expect(locale.formatNumber(1.001, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3 })).toEqual('1.001');
      expect(locale.formatNumber(1.001, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })).toEqual('1.001');
      expect(locale.formatNumber(1.0019, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })).toEqual('1.002');
      expect(locale.formatNumber(12345.6789, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3 })).toEqual('12,345.679');
      expect(locale.formatNumber(12345.6789, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })).toEqual('12,345.679');
    });

    it('Should format integers', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber(12345.123, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toEqual('12,345');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber(145000, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toEqual('145.000');
      expect(locale.formatNumber(283423, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toEqual('283.423');
      expect(locale.formatNumber(12345.123, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toEqual('12.345');
    });

    it('should handle locale group size', async () => {
      await locale.setLocale('en-US'); // 3, 3
      expect(locale.formatNumber(1234567.1234)).toEqual('1,234,567.123');
      expect(locale.formatNumber(12345678.1234)).toEqual('12,345,678.123');

      await locale.setLocale('nl-NL'); // 3, 3
      expect(locale.formatNumber(1234567.1234)).toEqual('1.234.567,123');
      expect(locale.formatNumber(12345678.1234)).toEqual('12.345.678,123');

      await locale.setLocale('hi-IN'); // 3, 2
      expect(locale.formatNumber(1234567.1234)).toEqual('12,34,567.123');
      expect(locale.formatNumber(12345678.1234)).toEqual('1,23,45,678.123');
    });

    it('should format decimals', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber(145000)).toEqual('145,000.00');
      expect(locale.formatNumber(283423)).toEqual('283,423.00');
      expect(locale.formatNumber(12345.1234)).toEqual('12,345.123');
      expect(locale.formatNumber(12345.123, { style: 'decimal', maximumFractionDigits: 2 })).toEqual('12,345.12');
      expect(locale.formatNumber(12345.123456, { style: 'decimal', maximumFractionDigits: 3 })).toEqual('12,345.123');
      expect(locale.formatNumber(0.0000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0.0000004');
      expect(locale.formatNumber(20.1, { style: 'decimal', round: true, minimumFractionDigits: 2 })).toEqual('20.10');
      expect(locale.formatNumber(20.1, { style: 'decimal', round: true })).toEqual('20.10');
      expect(locale.formatNumber('12,345.123')).toEqual('12,345.123');
      expect(locale.formatNumber(12345.1234, { group: '' })).toEqual('12345.123');
      expect(locale.formatNumber(5.1, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('5.10');
      expect(locale.formatNumber(145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 })).toEqual('145,000.00000');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber(145000)).toEqual('145.000,00');
      expect(locale.formatNumber(283423)).toEqual('283.423,00');
      expect(locale.formatNumber(12345.1)).toEqual('12.345,10');
      expect(locale.formatNumber(0.0000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0,0000004');
      expect(locale.formatNumber(0.000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0,000004');
      expect(locale.formatNumber(145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 })).toEqual('145.000,00000');

      await locale.setLocale('ar-EG');
      expect(locale.formatNumber(12345.1)).toEqual('١٢٬٣٤٥٫١٠');

      await locale.setLocale('bg-BG');
      expect(locale.formatNumber(12345.1)).toEqual('12 345,10');
    });

    it('should be able to parse string numbers into number type', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber('12345', { minimumFractionDigits: 0 })).toEqual('12,345');
    });

    it('should format currency', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber(12345.129, { style: 'currency', currency: 'USD' })).toEqual('$12,345.13');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber(12345.123, { style: 'currency', currency: 'EUR' })).toEqual('12.345,12 €');
    });

    it('should allow currency override', async () => {
      await locale.setLocale('es-ES');
      expect(locale.formatNumber(12345.12, { style: 'currency', currency: 'USD' })).toEqual('12.345,12 US$');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber(12345.12, { style: 'currency', currency: 'USD' })).toEqual('12.345,12 $');
    });

    it('should format percent', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatNumber(0.0500000, { style: 'percent', minimumFractionDigits: 0 })).toEqual('5%');
      expect(locale.formatNumber(0.050000, { style: 'percent', minimumFractionDigits: 0 })).toEqual('5%');
      expect(locale.formatNumber(0.05234, { style: 'percent', minimumFractionDigits: 4, maximumFractionDigits: 4 })).toEqual('5.2340%');
      expect(locale.formatNumber(0.57, { style: 'percent', minimumFractionDigits: 0 })).toEqual('57%');
      expect(locale.formatNumber(0.57, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.00%');
      expect(locale.formatNumber(0.5700, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.00%');
      expect(locale.formatNumber(0.57010, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.01%');
      expect(locale.formatNumber(0.5755, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.55%');
      expect(locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253.00%');
      expect(locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 0 })).toEqual('-253%');
      expect(locale.formatNumber(0.10, { style: 'percent', minimumFractionDigits: 0 })).toEqual('10%');
      expect(locale.formatNumber(1, { style: 'percent', minimumFractionDigits: 0 })).toEqual('100%');

      await locale.setLocale('tr-TR');
      expect(locale.formatNumber(0.0500000, { style: 'percent', minimumFractionDigits: 0 })).toEqual('%5');

      await locale.setLocale('it-IT');
      expect(locale.formatNumber(0.0500000, { style: 'percent', minimumFractionDigits: 0 })).toEqual('5%');

      await locale.setLocale('de-DE');
      expect(locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253,00 %');
      expect(locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 0 })).toEqual('-253 %');
      expect(locale.formatNumber(0.10, { style: 'percent', minimumFractionDigits: 0 })).toEqual('10 %');
      expect(locale.formatNumber(1, { style: 'percent', minimumFractionDigits: 0 })).toEqual('100 %');
    });
  });

  describe('Number Parsing', () => {
    it('should handle group size', async () => {
      await locale.setLocale('en-US'); // 3, 3

      expect(locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253.00%');
      expect(locale.formatNumber(1.1234)).toEqual('1.123');
      expect(locale.formatNumber(12.1234)).toEqual('12.123');
      expect(locale.formatNumber(123.1234)).toEqual('123.123');
      expect(locale.formatNumber(1234.1234)).toEqual('1,234.123');
      expect(locale.formatNumber(12345.1234)).toEqual('12,345.123');
      expect(locale.formatNumber(123456.1234)).toEqual('123,456.123');
      expect(locale.formatNumber(1234567.1234)).toEqual('1,234,567.123');
      expect(locale.formatNumber(12345678.1234)).toEqual('12,345,678.123');
      expect(locale.formatNumber(123456789.1234)).toEqual('123,456,789.123');
      expect(locale.formatNumber(1234567890.1234)).toEqual('1,234,567,890.123');
      expect(locale.formatNumber(123456789.1234, { style: 'currency', currency: 'USD' })).toEqual('$123,456,789.12');
      expect(locale.formatNumber(100, { style: 'percent', minimumFractionDigits: 0 })).toEqual('10,000%');

      await locale.setLocale('nl-NL'); // 3, 3

      expect(locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253,00%');
      expect(locale.formatNumber(1.1234)).toEqual('1,123');
      expect(locale.formatNumber(12.1234)).toEqual('12,123');
      expect(locale.formatNumber(123.1234)).toEqual('123,123');
      expect(locale.formatNumber(1234.1234)).toEqual('1.234,123');
      expect(locale.formatNumber(12345.1234)).toEqual('12.345,123');
      expect(locale.formatNumber(123456.1234)).toEqual('123.456,123');
      expect(locale.formatNumber(1234567.1234)).toEqual('1.234.567,123');
      expect(locale.formatNumber(12345678.1234)).toEqual('12.345.678,123');
      expect(locale.formatNumber(123456789.1234)).toEqual('123.456.789,123');
      expect(locale.formatNumber(1234567890.1234)).toEqual('1.234.567.890,123');
      expect(locale.formatNumber(123456789.1234, { style: 'currency', currency: 'EUR' })).toEqual('€ 123.456.789,12');
      expect(locale.formatNumber(100, { style: 'percent', minimumFractionDigits: 0 })).toEqual('10.000%');

      await locale.setLocale('hi-IN'); // 3, 2

      expect(locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253.00%');
      expect(locale.formatNumber(1.1234)).toEqual('1.123');
      expect(locale.formatNumber(12.1234)).toEqual('12.123');
      expect(locale.formatNumber(123.1234)).toEqual('123.123');
      expect(locale.formatNumber(1234.1234)).toEqual('1,234.123');
      expect(locale.formatNumber(12345.1234)).toEqual('12,345.123');
      expect(locale.formatNumber(123456.1234)).toEqual('1,23,456.123');
      expect(locale.formatNumber(1234567.1234)).toEqual('12,34,567.123');
      expect(locale.formatNumber(12345678.1234)).toEqual('1,23,45,678.123');
      expect(locale.formatNumber(123456789.1234)).toEqual('12,34,56,789.123');
      expect(locale.formatNumber(1234567890.1234)).toEqual('1,23,45,67,890.123');
      expect(locale.formatNumber(123456789.1234, { style: 'currency', currency: 'INR' })).toEqual('₹12,34,56,789.12');
      expect(locale.formatNumber(100, { style: 'percent', minimumFractionDigits: 0 })).toEqual('10,000%');
    });

    it('should handle numbers passed to parseNumber', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseNumber(4000)).toEqual(4000);
    });

    it('should handle group when passed to parseNumber', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseNumber('4.000', { group: '.' })).toEqual(4000);
    });

    it('should handle percentSign when passed to parseNumber', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseNumber('%40', { percentSign: '%' })).toEqual(40);
    });

    it('should handle currencySign when passed to parseNumber', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseNumber('€4,000', { currencySign: '€' })).toEqual(4000);
    });

    it('handle big numbers ending in decimal', async () => {
      expect(locale.formatNumber('-1,482,409,800.81')).toEqual('-1,482,409,800.81');
      expect(locale.parseNumber('-1,482,409,800.81')).toEqual(-1482409800.81);
    });

    it('handle other big numbers', async () => {
      expect(locale.formatNumber('123456789012345671')).toEqual('123,456,789,012,345,671.00');
      expect(locale.parseNumber('123456789012345671')).toEqual('123456789012345671');
      expect(locale.formatNumber('123456789012345678')).toEqual('123,456,789,012,345,678.00');
      expect(locale.parseNumber('123456789012345678')).toEqual('123456789012345678');
    });

    it('should parse numbers back', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseNumber('$12,345.13')).toEqual(12345.13);

      await locale.setLocale('de-DE');
      expect(locale.parseNumber('12.345,12 €')).toEqual(12345.12);
    });

    it('should format numbers in current locale', async () => {
      await locale.setLocale('nl-NL');

      expect(locale.parseNumber('100,00')).toEqual(100);
      expect(locale.parseNumber('836,45')).toEqual(836.45);
      expect(locale.parseNumber('1200,12')).toEqual(1200.12);
      expect(locale.parseNumber('10,99')).toEqual(10.99);
      expect(locale.parseNumber('130300,00')).toEqual(130300.00);
    });

    it('should return NaN for bad numbers', async () => {
      await locale.setLocale('en-US');
      expect(NaN).toEqual(NaN);
      expect(locale.parseNumber()).toEqual(NaN);
      expect(locale.parseNumber('')).toEqual(NaN);
      expect(locale.parseNumber('sdf')).toEqual(NaN);
      expect(locale.parseNumber(undefined)).toEqual(NaN);
    });

    it('should parse with decimal and group properties', async () => {
      // group = space; decimal = comma
      await locale.setLocale('fr-FR');
      expect(locale.parseNumber('1 234 567 890,1234')).toEqual(1234567890.1234);

      // // group = D9AC; decimal = D9AB
      await locale.setLocale('ar-SA');
      expect(locale.parseNumber('1٬234٬567٬890٫1234')).toEqual(1234567890.1234);

      // group = period; decimal = comma
      await locale.setLocale('es-ES');
      expect(locale.parseNumber('1.234.567.890,1234')).toEqual(1234567890.1234);

      // group = comma; decimal = period
      await locale.setLocale('en-US');
      expect(locale.parseNumber('1,234,567,890.1234')).toEqual(1234567890.1234);
    });

    it('should parse with multiple group separators', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseNumber('1,234,567,890.12346')).toEqual(1234567890.12346);
    });

    it('should parse big numbers', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseNumber('123456,789,012,345,678.123456')).toEqual('123456789012345678.123456');
      expect(locale.parseNumber('1123456789123456.57')).toEqual('1123456789123456.57');
      expect(locale.parseNumber('1,123,456,789,123,456.57')).toEqual('1123456789123456.57');

      await locale.setLocale('de-DE');
      expect(locale.parseNumber('123.456.789.012.345.678,123456')).toEqual('123456789012345678.123456');
    });

    it('should parse group size', async () => {
      await locale.setLocale('en-US'); // 3, 3
      expect(locale.parseNumber('-253.00 %')).toEqual(-253);
      expect(locale.parseNumber('1.123')).toEqual(1.123);
      expect(locale.parseNumber('12.123')).toEqual(12.123);
      expect(locale.parseNumber('123.123')).toEqual(123.123);
      expect(locale.parseNumber('1,234.123')).toEqual(1234.123);
      expect(locale.parseNumber('12,345.123')).toEqual(12345.123);
      expect(locale.parseNumber('123,456.123')).toEqual(123456.123);
      expect(locale.parseNumber('1234,567.123')).toEqual(1234567.123);
      expect(locale.parseNumber('12345,678.123')).toEqual((12345678.123));
      expect(locale.parseNumber('123456,789.123')).toEqual((123456789.123));
      expect(locale.parseNumber('1234567,890.123')).toEqual((1234567890.123));
      expect(locale.parseNumber('$123456,789.12')).toEqual((123456789.12));
      expect(locale.parseNumber('10,000 %')).toEqual((10000));

      await locale.setLocale('nl-NL'); // 3, 3

      expect(locale.parseNumber('-253,00 %')).toEqual(-253);
      expect(locale.parseNumber('1,123')).toEqual(1.123);
      expect(locale.parseNumber('12,123')).toEqual(12.123);
      expect(locale.parseNumber('123,123')).toEqual(123.123);
      expect(locale.parseNumber('1.234,123')).toEqual(1234.123);
      expect(locale.parseNumber('12.345,123')).toEqual(12345.123);
      expect(locale.parseNumber('123.456,123')).toEqual(123456.123);
      expect(locale.parseNumber('1234.567,123')).toEqual(1234567.123);
      expect(locale.parseNumber('12.345.678,123')).toEqual((12345678.123));
      expect(locale.parseNumber('123.456.789,123')).toEqual((123456789.123));
      expect(locale.parseNumber('1.234.567.890,123')).toEqual((1234567890.123));
      expect(locale.parseNumber('$123.456.789,12')).toEqual((123456789.12));
      expect(locale.parseNumber('10.000 %')).toEqual((10000));

      await locale.setLocale('hi-IN'); // 3, 2

      expect(locale.parseNumber('-253.00 %')).toEqual(-253);
      expect(locale.parseNumber('1.123')).toEqual(1.123);
      expect(locale.parseNumber('12.123')).toEqual(12.123);
      expect(locale.parseNumber('123.123')).toEqual(123.123);
      expect(locale.parseNumber('1,234.123')).toEqual(1234.123);
      expect(locale.parseNumber('12,345.123')).toEqual(12345.123);
      expect(locale.parseNumber('1,23,456.123')).toEqual(123456.123);
      expect(locale.parseNumber('12,34,567.123')).toEqual(1234567.123);
      expect(locale.parseNumber('1,23,45,678.123')).toEqual((12345678.123));
      expect(locale.parseNumber('12,34,56,789.123')).toEqual((123456789.123));
      expect(locale.parseNumber('1,23,45,67,890.123')).toEqual((1234567890.123));
      expect(locale.parseNumber('₹12,34,56,789.12')).toEqual((123456789.12));
      expect(locale.parseNumber('10,000 %')).toEqual((10000));
    });

    it('should be able to parse a number in a a non current locale', async () => {
      await locale.setLocale('nl-NL');
      await locale.setLocale('hi-IN');
      await locale.setLocale('en-US');

      expect(locale.parseNumber('-253,00 %', { locale: 'nl-NL' })).toEqual(-253);
      expect(locale.parseNumber('1.123', { locale: 'nl-NL' })).toEqual(1123);
      expect(locale.parseNumber('$123456.789,12', { locale: 'nl-NL' })).toEqual((123456789.12));
      expect(locale.parseNumber('€123456.789,12', { locale: 'nl-NL' })).toEqual((123456789.12));
      expect(locale.parseNumber('10.000 %', { locale: 'nl-NL' })).toEqual((10000));
      expect(locale.parseNumber('-253.00 %', { locale: 'hi-IN' })).toEqual(-253);
      expect(locale.parseNumber('1.123', { locale: 'hi-IN' })).toEqual(1.123);
      expect(locale.parseNumber('₹12,34,56,789.12', { locale: 'hi-IN' })).toEqual((123456789.12));
      expect(locale.parseNumber('10,000 %', { locale: 'hi-IN' })).toEqual((10000));
    });
  });

  describe('Right To Left', () => {
    it('should set the html lang and dir attribute', async () => {
      const container = new IdsContainer();
      document.body.appendChild(container);

      container.language = 'de';
      let html = window.document.getElementsByTagName('html')[0];
      expect(html.getAttribute('lang')).toEqual('de');
      expect(container.getAttribute('language')).toEqual('de');

      container.language = 'ar';
      html = window.document.getElementsByTagName('html')[0];
      expect(html.getAttribute('lang')).toEqual('ar');
      expect(container.getAttribute('language')).toEqual('ar');
      expect(container.getAttribute('dir')).toEqual('rtl');

      container.language = 'de';
      html = window.document.getElementsByTagName('html')[0];
      expect(html.getAttribute('lang')).toEqual('de');
      expect(container.getAttribute('language')).toEqual('de');
      expect(container.getAttribute('dir')).toEqual(null);
    });
  });

  describe('Date Formatting', () => {
    it('should be able to parse ISO (Json) dates', async () => {
      expect(locale.parseDate('2019-12-12T18:25:43.511Z').getTime()).toEqual(1576175143511);
    });

    it('should be able to parse 2 and 3 digit years', async () => {
      expect(locale.parseDate('10/10/10', { dateFormat: 'M/d/yyyy' }).getTime()).toEqual(new Date(2010, 9, 10, 0, 0, 0).getTime());
      expect(locale.parseDate('10/10/010', { dateFormat: 'M/d/yyyy' }).getTime()).toEqual(new Date(2010, 9, 10, 0, 0, 0).getTime());
    });

    it('should parse or format a string of four, six, or eight zeroes', async () => {
      expect(locale.parseDate('0000')).toEqual(undefined);
      expect(locale.parseDate('000000')).toEqual(undefined);
      expect(locale.parseDate('00000000')).toEqual(undefined);
      expect(locale.formatDate('0000')).toEqual('');
      expect(locale.formatDate('000000')).toEqual('');
      expect(locale.formatDate('00000000')).toEqual('');
    });

    it('should format a year and month locale', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2000, 10, 8, 13, 40), { month: 'long', day: 'numeric' })).toEqual('November 8');
      expect(locale.formatDate(new Date(2000, 10, 8, 13, 0), { month: 'long', year: 'numeric' })).toEqual('November 2000');

      await locale.setLocale('de-DE');
      expect(locale.formatDate(new Date(2000, 11, 1, 13, 40), { month: 'long', day: 'numeric' })).toEqual('1. Dezember');
      expect(locale.formatDate(new Date(2000, 11, 1, 13, 5), { month: 'long', year: 'numeric' })).toEqual('Dezember 2000');

      await locale.setLocale('sv-SE');
      expect(locale.formatDate(new Date(2000, 11, 1, 13, 40), { month: 'long', day: 'numeric' })).toEqual('1 december');
      expect(locale.formatDate(new Date(2000, 11, 1, 13, 5), { month: 'long', year: 'numeric' })).toEqual('december 2000');
    });

    it('should correct two digit year', () => {
      expect(locale.twoToFourDigitYear('40')).toEqual(1940);
      expect(locale.twoToFourDigitYear('20')).toEqual(2020);
      expect(locale.twoToFourDigitYear('940')).toEqual(1940);
      expect(locale.twoToFourDigitYear('020')).toEqual(2020);
    });

    it('should format datetimeMillis and timestampMillis', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2000, 10, 8, 13, 40, 30, 999), {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3
      })).toEqual('11/8/2000 1:40:30.999 PM');
      expect(locale.formatDate(new Date(2000, 10, 8, 13, 40, 30, 777), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3
      })).toEqual('1:40:30.777 PM');
    });

    it('should be able to return time format', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2015, 0, 8, 13, 40, 45), { timeStyle: 'medium' })).toEqual('1:40:45 PM');

      await locale.setLocale('de-DE');
      expect(locale.formatDate(new Date(2015, 0, 8, 13, 40, 45), { timeStyle: 'medium' })).toEqual('13:40:45');
    });

    it('should format dates in Slovak', async () => {
      await locale.setLocale('sk-SK');
      expect(locale.formatDate(new Date(2019, 7, 15), {
        month: 'long', weekday: 'long', day: 'numeric', year: 'numeric'
      })).toEqual('štvrtok 15. augusta 2019');
      expect(locale.formatDate(new Date(2019, 7, 15), {
        month: 'long', weekday: 'long', day: 'numeric', year: 'numeric'
      })).toEqual('štvrtok 15. augusta 2019');
    });

    it('should format time', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2000, 10, 8, 13, 40), { dateStyle: 'short', timeStyle: 'short' })).toEqual('11/8/2000 1:40 PM');
      expect(locale.formatDate(new Date(2000, 10, 8, 13, 0), { dateStyle: 'short', timeStyle: 'short' })).toEqual('11/8/2000 1:00 PM');

      await locale.setLocale('de-DE');
      expect(locale.formatDate(new Date(2000, 11, 1, 13, 40), { dateStyle: 'short', timeStyle: 'short' })).toEqual('01.12.2000 13:40');

      const date = new Date(2017, 1, 1, 17, 27, 40);
      const opts = { dateStyle: 'short', timeStyle: 'short' };
      await locale.setLocale('fi-FI');
      expect(locale.formatDate(date, opts)).toEqual('1.2.2017 17.27');

      await locale.setLocale('cs-CZ');
      expect(locale.formatDate(date, opts)).toEqual('01.02.2017 17:27');

      await locale.setLocale('hu-HU');
      expect(locale.formatDate(date, opts)).toEqual('2017. 02. 01. 17:27');

      await locale.setLocale('ja-JP');
      expect(locale.formatDate(date, opts)).toEqual('2017/02/01 17:27');

      await locale.setLocale('ru-RU');
      expect(locale.formatDate(date, opts)).toEqual('01.02.2017 17:27');
    });

    it('should format other dates', async () => {
      await locale.setLocale('de-DE');
      expect(locale.formatDate(new Date(2000, 10, 8))).toEqual('8.11.2000');
      expect(locale.formatDate(new Date(2000, 11, 1))).toEqual('1.12.2000');
      expect(locale.formatDate(new Date(2000, 10, 8), { dateStyle: 'short' })).toEqual('08.11.2000');
      expect(locale.formatDate(new Date(2000, 10, 8), { dateStyle: 'medium' })).toEqual('08.11.2000');
      expect(locale.formatDate(new Date(2000, 10, 8), { dateStyle: 'long' })).toEqual('8. November 2000');

      await locale.setLocale('fi-FI');
      expect(locale.formatDate(new Date(2000, 11, 1))).toEqual('1.12.2000');
    });

    it('should format millis', async () => {
      const opts = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3
      };
      expect(locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), opts)).toEqual('3/15/2016 12:30:36.142 PM');
      opts.hour12 = false;
      expect(locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), opts)).toEqual('3/15/2016 12:30:36.142');
    });

    it('should format timestamp in English', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2015, 10, 5, 10, 20, 5), { timeStyle: 'medium' })).toEqual('10:20:05 AM');
      expect(locale.formatDate(new Date(2015, 10, 5, 10, 20, 5), { timeStyle: 'short' })).toEqual('10:20 AM');
    });

    it('should format timestamp in Arabic', async () => {
      await locale.setLocale('ar-SA');
      expect(locale.formatDate(new Date(2000, 12, 1), { month: 'long', day: 'numeric' })).toEqual('٦ شوال');
      expect(locale.formatDate(new Date(2017, 10, 8), { month: 'long', day: 'numeric' })).toEqual('١٩ صفر');
    });

    it('should format en-US dates', async () => {
      await locale.setLocale('en-US');
      // Note date is year, month, day
      expect(locale.formatDate(new Date(2000, 10, 8))).toEqual('11/8/2000');
      expect(locale.formatDate(new Date(2000, 10, 8), { dateStyle: 'short' })).toEqual('11/8/2000');
      expect(locale.formatDate(new Date(2000, 10, 8), { dateStyle: 'medium' })).toEqual('Nov 8, 2000');
      expect(locale.formatDate(new Date(2000, 10, 8), { dateStyle: 'long' })).toEqual('November 8, 2000');
    });

    it('should be able to format a date in a a non current language', async () => {
      await locale.setLocale('nl-NL');
      await locale.setLocale('hi-IN');
      await locale.setLocale('en-US');

      expect(locale.calendar().dateFormat.short).toEqual('M/d/yyyy');
      expect(locale.formatDate(new Date(2019, 5, 8), {
        locale: 'nl', month: 'short', day: 'numeric', year: 'numeric'
      })).toEqual('8 jun. 2019');
      expect(locale.formatDate(new Date(2019, 5, 8), {
        locale: 'nl', month: 'long', day: 'numeric', year: 'numeric'
      })).toEqual('8 juni 2019');

      expect(locale.formatDate(new Date(2019, 5, 8), {
        locale: 'hi', month: 'short', day: 'numeric', year: 'numeric'
      })).toEqual('8 जून 2019');
      expect(locale.formatDate(new Date(2019, 5, 8), {
        locale: 'hi', month: 'long', day: 'numeric', year: 'numeric'
      })).toEqual('8 जून 2019');
    });

    it('should format arabic month format', async () => {
      await locale.setLocale('ar-SA');
      expect(locale.formatDate(new Date(2000, 12, 1), { month: 'long', day: 'numeric' })).toEqual('٦ شوال');
      expect(locale.formatDate(new Date(2017, 10, 8), { month: 'long', day: 'numeric' })).toEqual('١٩ صفر');
    });

    it('should format year in da-DK', async () => {
      await locale.setLocale('da-DK');
      expect(locale.formatDate(new Date(2019, 3, 1), { month: 'long', year: 'numeric' })).toEqual('april 2019');
    });

    it('should format hebrew dates', async () => {
      await locale.setLocale('he-IL');

      expect(locale.formatDate(new Date(2019, 12, 1), { dateStyle: 'short' })).toEqual('1.1.2020');
      expect(locale.formatDate(new Date(2019, 10, 8), { dateStyle: 'medium' })).toEqual('8 בנוב׳ 2019');
      expect(locale.formatDate(new Date(2019, 10, 8), { dateStyle: 'long' })).toEqual('8 בנובמבר 2019');
    });

    it('should format zh-Hans dates', async () => {
      await locale.setLocale('zh-Hans');
      expect(locale.formatDate(new Date(2019, 12, 1), { dateStyle: 'short' })).toEqual('2020/1/1');
      expect(locale.formatDate(new Date(2019, 10, 8), { dateStyle: 'medium' })).toEqual('2019年11月8日');
      expect(locale.formatDate(new Date(2019, 10, 8), { dateStyle: 'long' })).toEqual('2019年11月8日');
      expect(locale.formatDate(new Date(2019, 10, 8), { dateStyle: 'short', timeStyle: 'short' })).toEqual('2019/11/8 上午12:00');
    });

    it('should format year in es-ES', async () => {
      await locale.setLocale('es-ES');
      expect(locale.formatDate(new Date(2018, 10, 10), { month: 'long', year: 'numeric' })).toEqual('noviembre de 2018');
    });

    it('should format datetime in es-419', async () => {
      await locale.setLocale('es-419');
      expect(locale.formatDate(new Date(2018, 10, 10))).toEqual('10/11/2018');
      expect(locale.formatDate(new Date(2018, 10, 10), { dateStyle: 'medium' })).toEqual('10 nov. 2018');
      expect(locale.formatDate(new Date(2018, 10, 10), { dateStyle: 'long' })).toEqual('10 de noviembre de 2018');
      expect(locale.formatDate(new Date(2018, 10, 10), { dateStyle: 'full' })).toEqual('sábado, 10 de noviembre de 2018');
      expect(locale.formatDate(new Date(2018, 10, 10), { month: 'long', day: 'numeric' })).toEqual('10 de noviembre');
      expect(locale.formatDate(new Date(2018, 10, 10), { month: 'long', year: 'numeric' })).toEqual('noviembre de 2018');
      expect(locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), { timeStyle: 'medium' })).toEqual('14:15:12');
      expect(locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), { timeStyle: 'short' })).toEqual('14:15');
      expect(locale.formatDate('29/3/2018 14:15', {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric'
      })).toEqual('29/3/2018 14:15');

      let opts = {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
      };
      let date = new Date(2018, 10, 10, 14, 15, 12);
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('es-419', opts).format(date).replace(',', ''));

      opts = {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long'
      };
      date = new Date(2018, 10, 10);
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('es-419', opts).format(date).replace(',', ''));

      opts = {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'
      };
      date = new Date(2018, 10, 10);
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('es-419', opts).format(date).replace(',', ''));
    });

    it('should format long', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2015, 0, 8, 13, 40), { dateStyle: 'long' })).toEqual('January 8, 2015');

      await locale.setLocale('de-DE');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyle: 'long' })).toEqual('1. Januar 2015');

      await locale.setLocale('es-ES');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyle: 'long' })).toEqual('1 de enero de 2015');

      await locale.setLocale('lt-LT');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyle: 'long' })).toEqual('2015 m. sausio 1 d.');

      await locale.setLocale('vi-VN');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyle: 'long' })).toEqual('1 tháng 1, 2015');
    });

    it('should format fulll', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2015, 0, 8, 13, 40), { dateStyle: 'full' })).toEqual('Thursday, January 8, 2015');
      expect(locale.formatDate(new Date(2015, 2, 7, 13, 40), { dateStyle: 'full' })).toEqual('Saturday, March 7, 2015');

      await locale.setLocale('de-DE');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyle: 'full' })).toEqual('Donnerstag, 1. Januar 2015');
    });

    it('should format long days', async () => {
      await locale.setLocale('en-US');
      expect(locale.formatDate(new Date(2015, 0, 8, 13, 40), { dateStyle: 'long' })).toEqual('January 8, 2015');

      await locale.setLocale('de-DE');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyle: 'long' })).toEqual('1. Januar 2015');

      await locale.setLocale('ar-EG');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyle: 'long' })).toEqual('١ يناير ٢٠١٥');

      await locale.setLocale('bg-BG');
      expect(locale.formatDate(new Date(2015, 0, 1, 13, 40), { dateStyles: 'long' })).toEqual('1.01.2015 г.');
    });
  });

  describe('Timezone Dates', () => {
    it('should be able to display dates into another timezone including long timezone name', async () => {
      await locale.setLocale('en-US');
      const opts = {
        timeZoneName: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric'
      };

      opts.timeZone = 'Australia/Brisbane';
      const date = new Date(2018, 2, 26);
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));

      opts.timeZone = 'Asia/Shanghai';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));
      opts.timeZone = 'America/New_York';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));

      await locale.setLocale('nl-NL');
      opts.timeZone = 'Australia/Brisbane';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('nl-NL', opts).format(date).replace(',', ''));
      opts.timeZone = 'Asia/Shanghai';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('nl-NL', opts).format(date).replace(',', ''));
    });

    it('should be able to display dates into another timezone including short timezone name', async () => {
      const opts = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      };

      await locale.setLocale('en-US');
      opts.timeZone = 'Australia/Brisbane';
      const date = new Date(2018, 2, 26);
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));
      opts.timeZone = 'Asia/Shanghai';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));
      opts.timeZone = 'America/New_York';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));

      await locale.setLocale('nl-NL');
      opts.timeZone = 'Australia/Brisbane';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('nl-NL', opts).format(date).replace(',', ''));

      opts.timeZone = 'Asia/Shanghai';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('nl-NL', opts).format(date).replace(',', ''));
    });

    it('should be able to display dates into another timezone', async () => {
      const opts = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };

      await locale.setLocale('en-US');
      opts.timeZone = 'Australia/Brisbane';

      const date = new Date(2018, 2, 26);
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));
      opts.timeZone = 'Asia/Shanghai';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));
      opts.timeZone = 'America/New_York';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));

      await locale.setLocale('nl-NL');
      opts.timeZone = 'Asia/Shanghai';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('nl-NL', opts).format(date).replace(',', ''));

      opts.timeZone = 'America/New_York';
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('nl-NL', opts).format(date).replace(',', ''));
    });

    it('should be able to format timezones and timezones', async () => {
      const opts = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      };

      const date = new Date(2020, 6, 22, 21, 11, 12);
      await locale.setLocale('en-US');
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));

      await locale.setLocale('hr-HR');
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('hr-HR', opts).format(date).replace(',', ''));

      await locale.setLocale('it-IT');
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('it-IT', opts).format(date).replace(',', ''));

      await locale.setLocale('zh-Hant');
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('zh-Hant', opts).format(date).replace(',', ''));

      await locale.setLocale('zh-TW');
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('zh-TW', opts).format(date).replace(',', ''));
    });

    it('should format dates with long timezones', async () => {
      const opts = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'long'
      };

      const date = new Date(2018, 2, 22, 20, 11, 12);
      await locale.setLocale('en-US');
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('en-US', opts).format(date).replace(',', ''));

      await locale.setLocale('nl-NL');
      expect(locale.formatDate(date, opts))
        .toEqual(new Intl.DateTimeFormat('nl-NL', opts).format(date).replace(',', ''));
    });
  });

  describe('Hour Formatting', () => {
    it('should format hours', async () => {
      await locale.setLocale('en-US');

      expect(locale.formatHour(0)).toEqual('12:00 AM');
      expect(locale.formatHour('1')).toEqual('1:00 AM');
      expect(locale.formatHour('0:30')).toEqual('12:30 AM');
      expect(locale.formatHour(0.5)).toEqual('12:30 AM');
      expect(locale.formatHour(5)).toEqual('5:00 AM');
      expect(locale.formatHour('5:30')).toEqual('5:30 AM');
      expect(locale.formatHour(5.5)).toEqual('5:30 AM');
      expect(locale.formatHour(10)).toEqual('10:00 AM');
      expect(locale.formatHour('10:30')).toEqual('10:30 AM');
      expect(locale.formatHour(10.5)).toEqual('10:30 AM');
      expect(locale.formatHour(12)).toEqual('12:00 PM');
      expect(locale.formatHour('12:30')).toEqual('12:30 PM');
      expect(locale.formatHour(12.5)).toEqual('12:30 PM');
      expect(locale.formatHour(15)).toEqual('3:00 PM');
      expect(locale.formatHour('15:30')).toEqual('3:30 PM');
      expect(locale.formatHour(15.5)).toEqual('3:30 PM');
      expect(locale.formatHour(20)).toEqual('8:00 PM');
      expect(locale.formatHour('20:30')).toEqual('8:30 PM');
      expect(locale.formatHour(20.5)).toEqual('8:30 PM');
      expect(locale.formatHour(24)).toEqual('12:00 AM');
      expect(locale.formatHour('24:30')).toEqual('12:30 AM');
      expect(locale.formatHour(24.5)).toEqual('12:30 AM');

      await locale.setLocale('en-US');
    });

    it('should format hours in de-DE', async () => {
      await locale.setLocale('de-DE');

      expect(locale.formatHour(0)).toEqual('00:00');
      expect(locale.formatHour('0:30')).toEqual('00:30');
      expect(locale.formatHour(5)).toEqual('05:00');
      expect(locale.formatHour('5:30')).toEqual('05:30');
      expect(locale.formatHour(10)).toEqual('10:00');
      expect(locale.formatHour('10:30')).toEqual('10:30');
      expect(locale.formatHour(12)).toEqual('12:00');
      expect(locale.formatHour('12:30')).toEqual('12:30');
      expect(locale.formatHour(15)).toEqual('15:00');
      expect(locale.formatHour('15:30')).toEqual('15:30');
      expect(locale.formatHour(20)).toEqual('20:00');
      expect(locale.formatHour('20:30')).toEqual('20:30');
      expect(locale.formatHour(24)).toEqual('00:00');
      expect(locale.formatHour('24:30')).toEqual('00:30');

      await locale.setLocale('en-US');
    });

    it('should format hours in da-DK', async () => {
      await locale.setLocale('da-DK');

      expect(locale.formatHour(0)).toEqual('00.00');
      expect(locale.formatHour('0:30')).toEqual('00.30');
      expect(locale.formatHour('0.30')).toEqual('00.30');
      expect(locale.formatHour(5)).toEqual('05.00');
      expect(locale.formatHour('5:30')).toEqual('05.30');
      expect(locale.formatHour('5.30')).toEqual('05.30');
      expect(locale.formatHour(10)).toEqual('10.00');
      expect(locale.formatHour('10:30')).toEqual('10.30');
      expect(locale.formatHour(12)).toEqual('12.00');
      expect(locale.formatHour('12:30')).toEqual('12.30');
      expect(locale.formatHour(15)).toEqual('15.00');
      expect(locale.formatHour('15:30')).toEqual('15.30');
      expect(locale.formatHour(20)).toEqual('20.00');
      expect(locale.formatHour('20:30')).toEqual('20.30');
      expect(locale.formatHour(24)).toEqual('00.00');
      expect(locale.formatHour('24:30')).toEqual('00.30');

      await locale.setLocale('en-US');
    });

    it('should format hours in fi-FI', async () => {
      await locale.setLocale('fi-FI');

      expect(locale.formatHour(0)).toEqual('0.00');
      expect(locale.formatHour('0:30')).toEqual('0.30');
      expect(locale.formatHour('0.30')).toEqual('0.30');
      expect(locale.formatHour(5)).toEqual('5.00');
      expect(locale.formatHour('5:30')).toEqual('5.30');
      expect(locale.formatHour('5.30')).toEqual('5.30');
      expect(locale.formatHour(10)).toEqual('10.00');
      expect(locale.formatHour('10:30')).toEqual('10.30');
      expect(locale.formatHour(12)).toEqual('12.00');
      expect(locale.formatHour('12:30')).toEqual('12.30');
      expect(locale.formatHour(15)).toEqual('15.00');
      expect(locale.formatHour('15:30')).toEqual('15.30');
      expect(locale.formatHour(20)).toEqual('20.00');
      expect(locale.formatHour('20:30')).toEqual('20.30');
      expect(locale.formatHour(24)).toEqual('0.00');
      expect(locale.formatHour('24:30')).toEqual('0.30');

      await locale.setLocale('en-US');
    });

    it('should format hours in ko-KR', async () => {
      await locale.setLocale('ko-KR');

      expect(locale.formatHour(0)).toEqual('오전 12:00');
      expect(locale.formatHour('0:30')).toEqual('오전 12:30');
      expect(locale.formatHour(5)).toEqual('오전 5:00');
      expect(locale.formatHour('5:30')).toEqual('오전 5:30');
      expect(locale.formatHour(10)).toEqual('오전 10:00');
      expect(locale.formatHour('10:30')).toEqual('오전 10:30');
      expect(locale.formatHour(12)).toEqual('오후 12:00');
      expect(locale.formatHour('12:30')).toEqual('오후 12:30');
      expect(locale.formatHour(15)).toEqual('오후 3:00');
      expect(locale.formatHour('15:30')).toEqual('오후 3:30');
      expect(locale.formatHour(20)).toEqual('오후 8:00');
      expect(locale.formatHour('20:30')).toEqual('오후 8:30');
      expect(locale.formatHour(24)).toEqual('오전 12:00');
      expect(locale.formatHour('24:30')).toEqual('오전 12:30');

      await locale.setLocale('en-US');
    });

    it('should format hours in zh-Hant', async () => {
      await locale.setLocale('zh-Hant');

      expect(locale.formatHour(0)).toEqual('上午12:00');
      expect(locale.formatHour('0:30')).toEqual('上午12:30');
      expect(locale.formatHour(5)).toEqual('上午5:00');
      expect(locale.formatHour('5:30')).toEqual('上午5:30');
      expect(locale.formatHour(10)).toEqual('上午10:00');
      expect(locale.formatHour('10:30')).toEqual('上午10:30');
      expect(locale.formatHour(12)).toEqual('下午12:00');
      expect(locale.formatHour('12:30')).toEqual('下午12:30');
      expect(locale.formatHour(15)).toEqual('下午3:00');
      expect(locale.formatHour('15:30')).toEqual('下午3:30');
      expect(locale.formatHour(20)).toEqual('下午8:00');
      expect(locale.formatHour('20:30')).toEqual('下午8:30');
      expect(locale.formatHour(24)).toEqual('上午12:00');
      expect(locale.formatHour('24:30')).toEqual('上午12:30');

      await locale.setLocale('en-US');
    });

    it('should format hour range', async () => {
      await locale.setLocale('en-US');

      expect(locale.formatHourRange(0, 5)).toEqual('12 - 5:00 AM');
      expect(locale.formatHourRange(0.5, 5)).toEqual('12:30 - 5:00 AM');
      expect(locale.formatHourRange(5, 10)).toEqual('5 - 10:00 AM');
      expect(locale.formatHourRange(10, 12)).toEqual('10:00 AM - 12:00 PM');
      expect(locale.formatHourRange(10, 20)).toEqual('10:00 AM - 8:00 PM');
      expect(locale.formatHourRange(19, 20)).toEqual('7 - 8:00 PM');
      expect(locale.formatHourRange(12.5, 13)).toEqual('12:30 - 1:00 PM');
      expect(locale.formatHourRange(15.5, 17)).toEqual('3:30 - 5:00 PM');
      expect(locale.formatHourRange(20, 24)).toEqual('8:00 PM - 12:00 AM');

      await locale.setLocale('nl-NL');

      expect(locale.formatHourRange(0, 5)).toEqual('00:00 - 05:00');
      expect(locale.formatHourRange(0.5, 5)).toEqual('00:30 - 05:00');
      expect(locale.formatHourRange(0.25, 5)).toEqual('00:15 - 05:00');
      expect(locale.formatHourRange(5, 10)).toEqual('05:00 - 10:00');
      expect(locale.formatHourRange(10, 12)).toEqual('10:00 - 12:00');
      expect(locale.formatHourRange(10, 20)).toEqual('10:00 - 20:00');
      expect(locale.formatHourRange(19, 20)).toEqual('19:00 - 20:00');
      expect(locale.formatHourRange(12.5, 13)).toEqual('12:30 - 13:00');
      expect(locale.formatHourRange(15.5, 17)).toEqual('15:30 - 17:00');
      expect(locale.formatHourRange(15.25, 17)).toEqual('15:15 - 17:00');
      expect(locale.formatHourRange(20, 24)).toEqual('20:00 - 00:00');
    });
  });

  describe('Date Parsing', () => {
    it('should parseDate with single digit formats', async () => {
      expect(locale.parseDate('18.10.2019 7.15', { dateFormat: 'd.M.yyyy H.mm' }).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
      expect(locale.parseDate('18.10.2019 7.15', { dateFormat: 'd.M.yyyy H.mm' }).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
    });

    it('should parseDate in el-GR', async () => {
      await locale.setLocale('el-GR');
      expect(locale.parseDate('18/10/2019 7:15 π.μ.', { dateFormat: 'dd/MM/yyyy HH:mm a' }).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
      expect(locale.parseDate('18/10/2019 7:15 μ.μ.').getTime()).toEqual(new Date(2019, 9, 18, 19, 15, 0).getTime());
      expect(locale.parseDate('18/10/2019 12:00 π.μ.').getTime()).toEqual(new Date(2019, 9, 18, 0, 0, 0).getTime());
      expect(locale.parseDate('18/10/2019 12:00 μ.μ.').getTime()).toEqual(new Date(2019, 9, 18, 12, 0, 0).getTime());
      expect(locale.parseDate('18/10/2019 11:59 π.μ.').getTime()).toEqual(new Date(2019, 9, 18, 11, 59, 0).getTime());
      expect(locale.parseDate('18/10/2019 11:59 μ.μ.').getTime()).toEqual(new Date(2019, 9, 18, 23, 59, 0).getTime());
    });

    it('should parseDate in fi-FI', async () => {
      await locale.setLocale('fi-FI');
      expect(locale.parseDate('18.10.2019 7.15', { dateFormat: 'dd.MM.yyyy hh.mm' }).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
      expect(locale.parseDate('18.10.2019', { dateFormat: 'dd.MM.yyyy' }).getTime()).toEqual(new Date(2019, 9, 18, 0, 0, 0).getTime());
      expect(locale.parseDate('18.10.2019 7.15', { dateFormat: 'dd.MM.yyyy hh.mm' }).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
      expect(locale.parseDate('18.10.2019', { dateFormat: 'dd.MM.yyyy' }).getTime()).toEqual(new Date(2019, 9, 18, 0, 0, 0).getTime());
    });

    it('should parse dates with and without spaces, dash, comma format', async () => {
      await locale.setLocale('en-US');

      // Date with spaces, dashes and comma
      expect(locale.parseDate('2014-12-11', { dateFormat: 'yyyy-MM-dd' }).getTime()).toEqual(new Date(2014, 11, 11, 0, 0, 0).getTime());
      expect(locale.parseDate('2014/12/11', { dateFormat: 'yyyy/MM/dd' }).getTime()).toEqual(new Date(2014, 11, 11, 0, 0, 0).getTime());
    });

    it('should parse am/pm in Korean', async () => {
      await locale.setLocale('ko-KR');
      expect(locale.parseDate('2020-02-26 오전 12:00', { dateFormat: 'yyyy-MM-dd a h:mm' }).getTime())
        .toEqual(new Date(2020, 1, 26, 0, 0, 0).getTime());
      expect(locale.parseDate('2020-02-26 오후 12:00', { dateFormat: 'yyyy-MM-dd a h:mm' }).getTime())
        .toEqual(new Date(2020, 1, 26, 12, 0, 0).getTime());
    });

    it('should parse am/pm in zh-TW', async () => {
      await locale.setLocale('zh-TW');
      expect(locale.parseDate('2020/2/26 上午12:00', { dateFormat: 'yyyy/M/d ah:mm' }).getTime())
        .toEqual(new Date(2020, 1, 26, 0, 0, 0).getTime());
      expect(locale.parseDate('2020-02-26 下午12:00', { dateFormat: 'yyyy-M-d ah:mm' }).getTime())
        .toEqual(new Date(2020, 1, 26, 12, 0, 0).getTime());
      expect(locale.parseDate('2020/3/4 下午9:00', { dateFormat: 'yyyy/M/d ah:mm' }).getTime())
        .toEqual(new Date(2020, 2, 4, 21, 0, 0).getTime());
    });

    it('should be able to parse a date in a non current locale', async () => {
      await locale.setLocale('es-ES');
      await locale.setLocale('en-US');
      expect(locale.language.name).toEqual('en');
      expect(locale.parseDate('2019-01-01', { dateFormat: 'yyyy-MM-dd', locale: 'es-ES' }).getTime()).toEqual(new Date(2019, 0, 1, 0, 0, 0).getTime());
      expect(locale.parseDate('20/10/2019 20:12', { dateFormat: 'dd/MM/yyyy HH:mm', locale: 'es-ES' }).getTime()).toEqual(new Date(2019, 9, 20, 20, 12, 0).getTime());
    });

    it('should parse date in es-419', async () => {
      await locale.setLocale('es-419');
      const dateTest = locale.parseDate('29/4/2020 08:40', { dateStyle: 'short', timeStyle: 'short' });
      expect(dateTest.getTime()).toEqual(new Date(2020, 3, 29, 8, 40, 0).getTime());
    });

    it('should parse date in ar-SA', async () => {
      await locale.setLocale('ar-SA');
      const dateTest = locale.parseDate('1441/09/05 9:30 ص', { locale: 'ar-SA', pattern: 'yyyy/MM/dd h:mm a' });

      expect(dateTest[0]).toEqual(1441);
      expect(dateTest[1]).toEqual(8);
      expect(dateTest[2]).toEqual(5);
      expect(dateTest[3]).toEqual(9);
      expect(dateTest[4]).toEqual(30);
      expect(dateTest[5]).toEqual(0);
    });

    it('should parse date in Croatian (Croatia) hr-HR', async () => {
      await locale.setLocale('hr-HR');

      expect(locale.parseDate('01. 11. 2018. 05:25', { pattern: 'dd. MM. y. HH:mm' }).getTime()).toEqual(new Date(2018, 10, 1, 5, 25, 0).getTime());
      expect(locale.parseDate('01. 11. 2018. 17:25', { pattern: 'dd. MM. y. HH:mm' }).getTime()).toEqual(new Date(2018, 10, 1, 17, 25, 0).getTime());
    });

    it('should be able to parse dates', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseDate('11/8/2000').getTime()).toEqual(new Date(2000, 10, 8).getTime());
      expect(locale.parseDate('11/8/00').getTime()).toEqual(new Date(2000, 10, 8).getTime());

      await locale.setLocale('de-DE');
      expect(locale.parseDate('08.11.2000').getTime()).toEqual(new Date(2000, 10, 8).getTime());
    });

    it('should parse dates with month zero', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseDate('2016-01-01', { dateFormat: 'yyyy-MM-dd' }).getTime()).toEqual(new Date(2016, 0, 1).getTime());
      expect(locale.parseDate('2016-01-03', { dateFormat: 'yyyy-MM-dd' }).getTime()).toEqual(new Date(2016, 0, 3).getTime());
      expect(locale.parseDate('2016-01-31', { dateFormat: 'yyyy-MM-dd' }).getTime()).toEqual(new Date(2016, 0, 31).getTime());
    });

    it('should parse Dates with dashes in them', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseDate('2015-05-10', { dateFormat: 'yyyy-dd-MM' }).getTime()).toEqual(new Date(2015, 9, 5, 0, 0, 0).getTime());
      expect(locale.parseDate('05-10-2015', { dateFormat: 'dd-MM-yyyy' }).getTime()).toEqual(new Date(2015, 9, 5, 0, 0, 0).getTime());
    });

    it('should parse ISO Dates with dashes in them', async () => {
      await locale.setLocale('en-US');
      expect(locale.parseDate('2011-10-05T14:48:00.000Z').getTime()).toEqual(1317826080000);
    });
  });

  describe('Arabic/Islamic Calendar', () => {
    it('should support checking if using the islamic calendar', async () => {
      await locale.setLocale('en-US');
      expect(locale.isIslamic()).toEqual(false);

      await locale.setLocale('ar-SA');
      expect(locale.isIslamic()).toEqual(true);

      await locale.setLocale('es-ES');
      expect(locale.isIslamic()).toEqual(false);
      expect(locale.isIslamic('ar-SA')).toEqual(true);
      expect(locale.isIslamic('xx-XX')).toEqual(false);
    });

    it('should be able to test RTL', async () => {
      await locale.setLocale('en-US');
      expect(locale.isRTL()).toEqual(false);

      await locale.setLocale('ar-SA');
      expect(locale.isRTL()).toEqual(true);
      expect(locale.isRTL('en-US')).toEqual(false);
      expect(locale.isRTL('en')).toEqual(false);

      expect(locale.isRTL('ar-SA')).toEqual(true);
      expect(locale.isRTL('ar')).toEqual(true);
    });
  });
});
