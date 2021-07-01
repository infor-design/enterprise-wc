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
    it('should format times correctly', async () => {
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

    it('should support fr-CA able', async () => {
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
    it('should format millis', async () => {
      await locale.setLocale('en-US');

      expect(locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), { pattern: 'd/M/yyyy h:mm:ss.SSS a ' })).toEqual('15/3/2016 12:30:36.142 PM');
      expect(locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), { pattern: 'd/M/yyyy h:mm:ss.SSS ' })).toEqual('15/3/2016 12:30:36.142');
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
      expect(locale.formatDate(new Date(2000, 10, 8), { dateStyle: 'short' })).toEqual('11/8/00');
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

      expect(['10/11/2018 14:15 GMT-4', '10/11/2018 14:15 GMT-5']).toContain(locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
      }));
      expect(['2014-12-31', '10/11/2018 14:15 hora estándar oriental', '10/11/2018 14:15 hora de verano oriental']).toContain(locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), {
        year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long'
      }));
      expect(locale.formatDate(new Date(2018, 10, 10), {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'
      })).toEqual('10 de nov. de 2018 00:00');
    });
  });

  describe('Hour Formatting', () => {
    it('should format hours', async () => {
      await locale.setLocale('en-US');

      expect(locale.formatHour(0)).toEqual('12:00 AM');
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
