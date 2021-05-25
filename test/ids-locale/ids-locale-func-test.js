/**
 * @jest-environment jsdom
 */
import IdsLocale from '../../src/ids-locale/ids-locale';

describe('IdsLocale API', () => {
  let locale;

  beforeEach(async () => {
    locale = new IdsLocale();
    locale.language = 'en';
  });

  afterEach(async () => {
    document.body.innerHTML = '';
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

  it('renders correctly', () => {
    expect(locale).toBeTruthy();
    expect(locale.translate).toBeTruthy();
  });

  it('can set  correctly', () => {
    expect(locale).toBeTruthy();
    expect(locale.translate).toBeTruthy();
  });

  it('can set langauge with a setter', async () => {
    locale.language = 'no';

    expect(locale.language.name).toEqual('no');
  });

  // Translation Tests
  it('should treat no-NO and and nn-NO nb-NO as the same locale', async () => {
    await locale.setLanguage('no');
    expect(locale.translate('Loading')).toEqual('Laster');

    await locale.setLanguage('nb');
    expect(locale.translate('Loading')).toEqual('Laster');

    await locale.setLanguage('nn');
    expect(locale.translate('Loading')).toEqual('Laster');
  });

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

  it('should show undefined keys with [] around them', async () => {
    await locale.setLanguage('en-US');

    expect(locale.translate('TestLocaleDefaults')).toEqual('Test Locale Defaults');
    await locale.setLanguage('de-DE');

    expect(locale.translate('TestLocaleDefaults')).toEqual('Test Locale Defaults');
    await locale.setLanguage('ar-EG');

    expect(locale.translate('XYZ')).toEqual('[XYZ]');
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

  it('should map in and iw', async () => {
    await locale.setLanguage('in-ID');
    expect(locale.language.name).toEqual('id');

    await locale.setLanguage('iw');
    expect(locale.language.name).toEqual('he');
  });

  // Format Number Tests
  it('supports unicode', async () => {
    expect(locale.formatNumber(2019, { locale: 'ar-SA' })).toEqual('٢٬٠١٩٫٠٠');
    expect(locale.formatNumber(2019, { locale: 'zh-Hans-CN-u-nu-hanidec' })).toEqual('二,〇一九.〇〇');
  });

  it('should format numbers and handle exceptions', () => {
    expect(locale.formatNumber(undefined, { date: 'timestamp' })).toEqual('NaN');
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
    expect(locale.formatNumber(12345.123, { style: 'integer' })).toEqual('12,345');

    await locale.setLocale('de-DE');

    expect(locale.formatNumber(145000, { style: 'integer' })).toEqual('145.000');
    expect(locale.formatNumber(283423, { style: 'integer' })).toEqual('283.423');
    expect(locale.formatNumber(12345.123, { style: 'integer' })).toEqual('12.345');
  });
});
