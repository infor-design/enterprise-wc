/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/ids-container/ids-container';
import IdsText from '../../src/ids-text/ids-text';

describe('IdsText Component', () => {
  let elem;

  beforeEach(async () => {
    const text = new IdsText();
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
    elem.template();
    expect(elem.color).toEqual('unset');
    elem.color = null;
    expect(elem.fontSize).toEqual(null);
    expect(elem.getAttribute('color')).toEqual(null);
  });

  it('renders font weight setting', () => {
    expect(elem.fontWeight).toEqual(null);
    elem.fontWeight = 'bold';
    expect(elem.getAttribute('font-weight')).toEqual('bold');

    elem.fontWeight = 'bolder';
    expect(elem.getAttribute('font-weight')).toEqual('bolder');

    elem.fontWeight = undefined;
    expect(elem.fontWeight).toEqual(null);

    elem.fontWeight = '';
    expect(elem.fontWeight).toEqual(null);

    document.body.innerHTML = '';
    const templateElem = document.createElement('template');
    templateElem.innerHTML = '<ids-text font-weight="bold">I am bold</ids-text>';
    elem = templateElem.content.childNodes[0];
    document.body.appendChild(elem);
    expect(elem.fontWeight).toEqual('bold');
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

  it('renders disabled setting', () => {
    elem.disabled = 'true';
    expect(elem.disabled).toEqual('true');
    elem.disabled = false;
    expect(elem.disabled).toEqual(null);
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
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(0);
    elem.audible = true;
    elem.template();
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(1);
    elem.audible = false;
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(0);
  });

  it('renders error setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    expect(elem.shadowRoot.querySelector('span').classList.contains('error')).toEqual(false);
    elem.error = true;
    expect(elem.shadowRoot.querySelector('span').classList.contains('error')).toEqual(true);
    expect(elem.error).toEqual('true');
    elem.error = false;
    expect(elem.error).toEqual(null);
  });

  it('renders label setting then removes it', () => {
    elem = new IdsText();
    document.body.appendChild(elem);
    expect(elem.shadowRoot.querySelector('span').classList.contains('label')).toEqual(false);
    elem.label = true;
    expect(elem.shadowRoot.querySelector('span').classList.contains('label')).toEqual(true);
    expect(elem.label).toEqual('true');
    elem.label = false;
    expect(elem.label).toEqual(null);
  });

  it('renders with audible setting enabled, then removes it', () => { // ids-text audible
    document.body.innerHTML = '';
    const templateElem = document.createElement('template');
    templateElem.innerHTML = '<ids-text audible>Hello World, Can you hear me?</ids-text>';
    elem = templateElem.content.childNodes[0];
    document.body.appendChild(elem);
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(1);
    elem.audible = false;
    expect(elem.shadowRoot.querySelectorAll('.audible').length).toEqual(0);
  });

  it('can translate text', async () => {
    const container = new IdsContainer();
    const text = new IdsText();
    text.textContent = 'BrowserLanguage';
    text.translateText = true;
    container.appendChild(text);
    document.body.appendChild(container);

    await container.setLanguage('en');
    expect(text.textContent).toEqual('Browser Language');
    await container.setLanguage('fi');
    expect(text.textContent).toEqual('Selaimen kieli');

    text.removeAttribute('translation-key');
    text.textContent = 'Test';
    expect(text.textContent).toEqual('Test');

    text.translateText = false;
    expect(text.textContent).toEqual('Test');
  });
});
