/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsTag from '../../src/components/ids-tag/ids-tag';
import IdsThemeSwitcher from '../../src/components/ids-theme-switcher/ids-theme-switcher';

describe('IdsThemeMixin Tests', () => {
  let elem: any;
  let switcher: any;

  beforeEach(async () => {
    elem = new IdsTag();
    switcher = new IdsThemeSwitcher();
    document.body.appendChild(switcher);
    document.body.appendChild(elem);
    elem.initThemeHandlers();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    elem = null;
  });

  it('sets up mode and version setters', () => {
    elem.mode = 'dark';
    expect(elem.container.getAttribute('mode')).toEqual('dark');
  });

  it('fires themechanged event', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.mode).toEqual('dark');
    });

    switcher.addEventListener('themechanged', mockCallback);
    switcher.mode = 'dark';

    expect(mockCallback.mock.calls.length).toBe(2);
    expect(elem.mode).toEqual('dark');
  });
});
