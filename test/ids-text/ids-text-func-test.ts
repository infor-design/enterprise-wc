/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsText from '../../src/components/ids-text/ids-text';
import { messages as fiMessages } from '../../src/components/ids-locale/data/fi-messages';
import processAnimFrame from '../helpers/process-anim-frame';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsText Component', () => {
  let elem: any;

  beforeEach(async () => {
    const text: any = new IdsText();
    document.body.appendChild(text);
    elem = document.querySelector('ids-text');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsText();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-text').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(elem.outerHTML).toMatchSnapshot();
    elem.fontSize = 24;
    expect(elem.outerHTML).toMatchSnapshot();
    elem.type = 'h1';
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('renders font size setting', () => {
    elem.fontSize = 24;
    expect(elem.fontSize).toEqual('24');
    expect(document.querySelectorAll('ids-text').length).toEqual(1);
  });

  it('renders font-size setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    elem.fontSize = 24;
    expect(elem.fontSize).toEqual('24');
    elem.fontSize = null;
    expect(elem.fontSize).toEqual(null);
    expect(elem.getAttribute('font-size')).toEqual(null);
  });

  it('renders color setting as "unset", then removes it', () => {
    elem = new IdsText();
    elem.color = 'unset';
    document.body.appendChild(elem);
    elem.render();
    expect(elem.color).toEqual('unset');
    elem.color = null;
    expect(elem.fontSize).toEqual(null);
    expect(elem.getAttribute('color')).toEqual(null);
  });

  it('renders font weight setting', () => {
    expect(elem.fontWeight).toEqual(null);
    elem.fontWeight = 'bold';
    expect(elem.getAttribute('font-weight')).toEqual('bold');

    elem.fontWeight = 'lighter';
    expect(elem.getAttribute('font-weight')).toEqual('lighter');

    elem.fontWeight = undefined;
    expect(elem.fontWeight).toEqual(null);

    elem.fontWeight = '';
    expect(elem.fontWeight).toEqual(null);

    document.body.innerHTML = '';
    const templateElem = document.createElement('template');
    templateElem.innerHTML = '<ids-text font-weight="semi-bold">I am bold</ids-text>';
    elem = templateElem.content.childNodes[0];
    document.body.appendChild(elem);
    expect(elem.fontWeight).toEqual('semi-bold');
  });

  it('renders overflow setting', () => {
    elem = new IdsText();
    expect(elem.overflow).toEqual(null);
    elem.overflow = 'bad-value';
    expect(elem.getAttribute('overflow')).toEqual(null);

    elem.overflow = 'ellipsis';
    expect(elem.getAttribute('overflow')).toEqual('ellipsis');
    elem.overflow = undefined;
    expect(elem.overflow).toEqual(null);

    document.body.innerHTML = '';

    let templateElem = document.createElement('template');
    templateElem.innerHTML = '<ids-text>Do not cut off</ids-text>';
    elem = templateElem.content.childNodes[0];
    document.body.appendChild(elem);
    expect(elem.overflow).toEqual(null);

    document.body.innerHTML = '';
    templateElem = document.createElement('template');
    templateElem.innerHTML = '<ids-text overflow="ellipsis">Cuts off at some point</ids-text>';
    elem = templateElem.content.childNodes[0];
    document.body.appendChild(elem);
    expect(elem.overflow).toEqual('ellipsis');
  });

  it('renders type setting', () => {
    elem = new IdsText();
    elem.type = 'h1';
    expect(elem.type).toEqual('h1');
    expect(elem.shadowRoot.querySelectorAll('h1').length).toEqual(1);
  });

  it('renders type setting with classes', () => {
    elem = new IdsText();
    elem.type = 'label';
    expect(elem.type).toEqual('label');
    expect(elem.container.classList.contains('label')).toEqual(true);
  });

  it('renders disabled setting', () => {
    elem.disabled = 'true';
    expect(elem.disabled).toEqual(true);
    elem.disabled = false;
    expect(elem.disabled).toEqual(false);
  });

  it('renders font-size setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    elem.type = 'h1';
    expect(elem.type).toEqual('h1');
    elem.type = null;
    expect(elem.type).toEqual(null);
    expect(elem.getAttribute('type')).toEqual(null);
    expect(elem.shadowRoot.querySelectorAll('span').length).toEqual(1);
  });

  it('renders audible setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    elem = document.querySelector('ids-text');

    expect(elem.audible).toEqual(false);
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(0);
    elem.audible = true;

    expect(elem.audible).toEqual(true);
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(1);
    elem.audible = false;

    expect(elem.audible).toEqual(false);
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(0);
  });

  it('renders error setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    expect(elem.shadowRoot.querySelector('span').classList.contains('error')).toEqual(false);
    elem.error = true;
    expect(elem.shadowRoot.querySelector('span').classList.contains('error')).toEqual(true);
    expect(elem.error).toEqual(true);
    elem.error = false;
    expect(elem.error).toEqual(false);
  });

  it('renders label setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    expect(elem.shadowRoot.querySelector('span').classList.contains('label')).toEqual(false);
    elem.label = true;
    expect(elem.shadowRoot.querySelector('span').classList.contains('label')).toEqual(true);
    expect(elem.label).toEqual(true);
    elem.label = false;
    expect(elem.label).toEqual(false);
  });

  it('renders data setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    expect(elem.shadowRoot.querySelector('span').classList.contains('data')).toEqual(false);
    elem.data = true;
    expect(elem.shadowRoot.querySelector('span').classList.contains('data')).toEqual(true);
    expect(elem.data).toEqual(true);
    elem.data = false;
    expect(elem.data).toEqual(false);
  });

  it('renders with audible setting enabled, then removes it', () => {
    document.body.innerHTML = '';
    const templateElem = document.createElement('template');
    templateElem.innerHTML = '<ids-text audible>Hello World, Can you hear me?</ids-text>';
    elem = templateElem.content.childNodes[0];
    document.body.appendChild(elem);
    elem = document.querySelector('ids-text');

    expect(elem.audible).toEqual(true);
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(1);
    elem.audible = false;

    expect(elem.audible).toEqual(false);
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(0);
  });

  it('renders via document.createElement (append late)', () => {
    const errors = jest.spyOn(global.console, 'error');
    const textElem: any = document.createElement('ids-text');

    textElem.type = 'h1';
    textElem.fontSize = 24;
    textElem.fontWeight = 'bold';
    textElem.textContent = 'Test Text';
    document.body.appendChild(textElem);

    expect(textElem.type).toEqual('h1');
    expect(textElem.fontSize).toEqual('24');
    expect(textElem.fontWeight).toEqual('bold');
    expect(textElem.textContent).toEqual('Test Text');
    expect(errors).not.toHaveBeenCalled();
  });

  it('can render a color from the color palette', () => {
    elem.color = 'slate-10';
    expect(elem.color).toEqual('slate-10');
    expect(elem.container.style.color).toEqual('');
  });

  it.skip('can translate text', async () => {
    const container: any = new IdsContainer();
    IdsGlobal.getLocale().loadedLanguages.set('fi', fiMessages);
    const text: any = new IdsText();
    text.textContent = 'BrowserLanguage';
    text.translateText = true;
    container.appendChild(text);
    document.body.appendChild(container);

    await IdsGlobal.getLocale().setLanguage('en');
    await processAnimFrame();
    expect(text.textContent).toEqual('Browser language');
    await IdsGlobal.getLocale().setLanguage('fi');
    await processAnimFrame();
    expect(text.textContent).toEqual('Selaimen kieli');

    text.removeAttribute('translation-key');
    text.textContent = 'Test';
    expect(text.textContent).toEqual('Test');

    text.translateText = false;
    expect(text.textContent).toEqual('Test');
  });
});
