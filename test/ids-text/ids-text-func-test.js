/**
 * @jest-environment jsdom
 */
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

  it('renders type setting', () => {
    elem.type = 'h1';
    expect(elem.type).toEqual('h1');
    expect(elem.shadowRoot.querySelectorAll('h1').length).toEqual(1);
  });

  it('renders disabled setting', () => {
    elem.disabled = 'true';
    expect(elem.disabled).toEqual('true');
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
});
