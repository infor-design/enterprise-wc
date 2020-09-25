/**
 * @jest-environment jsdom
 */
import { IdsResizeMixin as idsResize } from '../../src/ids-base/ids-resize-mixin';
import IdsPopup from '../../src/ids-popup/ids-popup';

describe('IdsResizeMixin Tests', () => {
  let elem;

  beforeEach(async () => {
    elem = new IdsPopup();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    elem = null;
  });

  it('has access to resizeObserver methods', () => {
    // @TODO see if we can stub out ResizeObserver/MutationObserver in the testbed
    if (typeof ResizeObserver !== 'undefined') {
      expect(elem.ro).toBeDefined();
    }
    if (typeof MutationObserver !== 'undefined') {
      expect(elem.mo).toBeDefined();
    }

    expect(typeof elem.setupResize).toBe('function');
    expect(typeof elem.disconnectResize).toBe('function');
    expect(typeof elem.setupDetectMutations).toBe('function');
    expect(typeof elem.disconnectDetectMutations).toBe('function');

    // @TODO revisit these when the observers can be used in the testbed.
    expect(elem.shouldResize()).toBeFalsy();
    expect(elem.shouldDetectMutations()).toBeTruthy();
  });
});
