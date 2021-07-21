/**
 * @jest-environment jsdom
 */
import IdsText from '../../src/ids-text/ids-text';

let elem;

describe('IdsLocaleMixin Tests', () => {
  beforeEach(async () => {
    elem = new IdsText();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can language via the mixin', async () => {
    elem.language = 'de';
    expect(elem.getAttribute('language')).toEqual('de');
    elem.language = '';
    expect(elem.getAttribute('language')).toEqual('de');
    await elem.setLanguage('de');
    expect(elem.getAttribute('language')).toEqual('de');
  });

  it('can locale via the mixin', async () => {
    elem.locale = 'de-DE';
    expect(elem.getAttribute('locale')).toEqual('de-DE');
    elem.locale = '';
    expect(elem.getAttribute('locale')).toEqual('de-DE');
    await elem.setLocale('de-DE');
    await elem.setLocale('');
    expect(elem.getAttribute('locale')).toEqual('de-DE');
  });

  it('can inverse the locale/language connectedCallback', async () => {
    elem.setAttribute('locale', 'de-DE');
    elem.setAttribute('language', 'de');
    elem.connectedCallback();
    expect(elem.getAttribute('locale')).toEqual('de-DE');
    expect(elem.getAttribute('language')).toEqual('de');
  });
});
