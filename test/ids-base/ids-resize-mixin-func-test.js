/**
 * @jest-environment jsdom
 */
import IdsResizeMixin from '../../src/ids-mixins/ids-resize-mixin';
import IdsPopup from '../../src/ids-popup/ids-popup';

const resizeObserverMock = jest.fn(function ResizeObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  this.unobserve = jest.fn();
  this.trigger = (entryList) => {
    callback(entryList, this);
  };
});
global.ResizeObserver = resizeObserverMock;

// =========================
// Mock MutationObserver
const mutationObserverMock = jest.fn(function MutationObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  this.trigger = (mockedMutationsList) => {
    callback(mockedMutationsList, this);
  };
});
global.MutationObserver = mutationObserverMock;

describe('IdsResizeMixin Tests', () => {
  let elem;
  let container;

  beforeEach(async () => {
    elem = new IdsPopup();
    container = document.createElement('div');
    container.id = 'test-container';

    document.body.appendChild(container);
    container.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    elem = null;
    container = null;
  });

  it('has access to global resizeObserver methods', () => {
    if (typeof ResizeObserver !== 'undefined') {
      expect(elem.ro).toBeDefined();
      expect(resizeObserverMock.mock.instances.length).toBe(1);
    }

    expect(typeof elem.setupResize).toBe('function');
    expect(typeof elem.disconnectResize).toBe('function');
    expect(typeof elem.addObservedElement).toBe('function');
    expect(typeof elem.removeObservedElement).toBe('function');

    expect(Array.isArray(elem.observed)).toBeTruthy();

    expect(elem.shouldResize()).toBeTruthy();
  });

  it('uses the global resizeObserver', () => {
    const [instance] = mutationObserverMock.mock.instances;

    elem.refresh = jest.fn();
    instance.trigger([
      {
        target: container,
        contentRect: {
          x: 0,
          y: 0,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: 0,
          height: 0
        }
      }
    ]);

    expect(elem.refresh).toHaveBeenCalledTimes(1);
  });

  // NOTE: runs the `disconnectResize` method, which cleans some things up
  it('should allow implementing components to disconnect safely', (done) => {
    const errors = jest.spyOn(global.console, 'error');

    elem.remove();

    setTimeout(() => {
      expect(errors).not.toHaveBeenCalled();
      expect(elem.ro).toBe(undefined);
      done();
    }, 20);
  });

  it('can add/remove elements observed by the ResizeObserver', () => {
    const newElem = document.createElement('div');
    newElem.id = 'new-elem';
    document.body.appendChild(newElem);

    elem.addObservedElement(newElem);

    expect(elem.observed.length).toBe(1);

    // Can't add the same one twice
    elem.addObservedElement(newElem);

    expect(elem.observed.length).toBe(1);

    elem.removeObservedElement(newElem);

    expect(elem.observed.length).toBe(0);

    // Can't remove it if it's not present in the observed array
    elem.removeObservedElement(newElem);

    expect(elem.observed.length).toBe(0);
  });

  it('can\'t add non-elements to the observed elements array', () => {
    expect(typeof elem.addObservedElement).toBe('function');
    elem.addObservedElement({});

    expect(elem.observed.length).toBe(0);
  });

  it('can\'t remove non-elements to the observed elements array', () => {
    expect(typeof elem.removeObservedElement).toEqual('function');
    elem.removeObservedElement({});

    expect(elem.observed.length).toBe(0);
  });

  it('sets up a mutation observer', () => {
    if (typeof MutationObserver !== 'undefined') {
      expect(elem.mo).toBeDefined();
      expect(Array.isArray(elem.mutationTargets)).toBeTruthy();
      expect(mutationObserverMock.mock.instances.length).toBe(1);
    }

    expect(typeof elem.setupDetectMutations).toBe('function');
    expect(typeof elem.disconnectDetectMutations).toBe('function');

    expect(elem.shouldDetectMutations()).toBeTruthy();
  });

  if (typeof MutationObserver !== 'undefined') {
    it('uses the mutation observer', () => {
      const [instance] = mutationObserverMock.mock.instances;

      elem.refresh = jest.fn();
      instance.trigger({
        type: 'attributes'
      });

      expect(elem.refresh).toHaveBeenCalledTimes(1);

      // ChildList types currently don't trigger this MutationObserver.
      // This shouldn't increase the number of times called.
      instance.trigger({
        type: 'childList'
      });

      expect(elem.refresh).toHaveBeenCalledTimes(1);
    });
  }
});
