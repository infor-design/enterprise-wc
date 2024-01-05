/**
 * @jest-environment jsdom
 */
import IdsSkipLink from '../../src/components/ids-skip-link/ids-skip-link';

describe('IdsSkipLink Component', () => {
  let elem: IdsSkipLink;

  beforeEach(async () => {
    elem = new IdsSkipLink();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
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
});
