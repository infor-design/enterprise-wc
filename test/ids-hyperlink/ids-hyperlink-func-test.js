/**
 * @jest-environment jsdom
 */
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

describe('IdsHyperlink Component', () => {
  let elem;

  beforeEach(async () => {
    const link = new IdsHyperlink();
    document.body.appendChild(link);
    elem = document.querySelector('ids-hyperlink');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsHyperlink();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-hyperlink').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    elem.href = 'test';
    elem.target = '_blank';
  });

  it('renders href setting', () => {
    elem.href = 'test';
    expect(elem.href).toEqual('test');
    expect(document.querySelectorAll('[href="test"]').length).toEqual(1);
  });

  it('renders href setting then removes it', () => {
    elem.href = 'test';
    expect(elem.href).toEqual('test');
    elem.href = null;
    expect(elem.href).toEqual(null);
    expect(elem.getAttribute('href')).toEqual(null);
  });

  it('renders target setting', () => {
    elem.target = '_blank';
    expect(elem.target).toEqual('_blank');
    expect(elem.getAttribute('target')).toEqual('_blank');
  });

  it('renders target setting then removes it', () => {
    elem = new IdsHyperlink();
    document.body.appendChild(elem);
    elem.target = '_blank';
    expect(elem.target).toEqual('_blank');
    elem.target = null;
    expect(elem.target).toEqual(null);
    expect(elem.getAttribute('target')).toEqual(null);
  });

  it('renders text-decoration setting', () => {
    elem.textDecoration = 'none';
    expect(elem.container.classList.contains('ids-text-decoration-none')).toBeTruthy();
    expect(elem.getAttribute('text-decoration')).toEqual('none');
    expect(elem.textDecoration).toEqual('none');

    elem.textDecoration = 'hover';
    expect(elem.container.classList.contains('ids-text-decoration-hover')).toBeTruthy();
    expect(elem.getAttribute('text-decoration')).toEqual('hover');
    expect(elem.textDecoration).toEqual('hover');
  });

  it('renders target setting then removes it', () => {
    elem = new IdsHyperlink();
    document.body.appendChild(elem);
    expect(elem.textDecoration).toEqual(null);
    elem.textDecoration = 'none';
    elem.textDecoration = null;
    expect(elem.textDecoration).toEqual(null);
    expect(elem.getAttribute('text-decoration')).toEqual(null);
  });

  it('renders disabled setting then removes it', () => { // ids-text audible
    elem = new IdsHyperlink();
    document.body.appendChild(elem);
    elem.disabled = true;
    expect(elem.disabled).toEqual('true');
    expect(elem.shadowRoot.querySelector('a').getAttribute('disabled')).toEqual('true');
    expect(elem.shadowRoot.querySelector('a').getAttribute('tabindex')).toEqual('-1');
    elem.disabled = false;
    expect(elem.disabled).toEqual(null);
    expect(elem.shadowRoot.querySelector('a').getAttribute('disabled')).toEqual(null);
    expect(elem.shadowRoot.querySelector('a').getAttribute('tabindex')).toEqual(null);
  });

  it('supports setting mode', () => {
    elem.mode = 'dark';
    expect(elem.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    elem.version = 'classic';
    expect(elem.container.getAttribute('version')).toEqual('classic');
  });

  it('unsets the color', () => {
    elem.color = 'unset';
    expect(elem.getAttribute('color')).toEqual('unset');
    expect(elem.color).toEqual('unset');
  });

  it('does not render a color for inputs other than unset', () => {
    elem.color = 'blue';
    expect(elem.getAttribute('color')).toEqual(null);
    expect(elem.color).toEqual(null);
  });

  it('sets a given font size', () => {
    elem.fontSize = 14;
    expect(elem.getAttribute('font-size')).toEqual('14');
  });

  it('sets font weight to bold or lighter', () => {
    elem.fontWeight = 'bold';
    expect(elem.getAttribute('font-weight')).toEqual('bold');
    elem.fontWeight = 'lighter';
    expect(elem.getAttribute('font-weight')).toEqual('lighter');
  });

  it('removes font size if attribute is empty', () => {
    elem.fontSize = '';
    expect(elem.getAttribute('font-size')).toEqual(null);
    expect(elem.fontSize).toEqual(null);
  });

  it('does not set font weight to anything other than bold or lighter', () => {
    elem.fontWeight = 'extra bold';
    expect(elem.getAttribute('font-weight')).toEqual(null);
    expect(elem.fontWeight).toEqual(null);
  });

  /* To do */
  // it('doesn\'t set the role attribute if one already exists', () => {

  // })
});
