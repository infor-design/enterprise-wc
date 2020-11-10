/**
 * @jest-environment jsdom
 */
import IdsRenderLoop from '../../src/ids-render-loop/ids-render-loop';
import IdsRenderLoopItem from '../../src/ids-render-loop/ids-render-loop-item';
import { IdsRenderLoopMixin } from '../../src/ids-render-loop/ids-render-loop-mixin';

// Supporting Components
import IdsIcon from '../../src/ids-icon/ids-icon';

describe('Ids RenderLoop', () => {
  let icon;
  let iconEl;
  let loop;

  beforeEach(() => {
    icon = new IdsIcon();
    icon.setAttribute('icon', 'settings');
    document.body.appendChild(icon);
    icon.rl = new IdsRenderLoop();
    iconEl = document.querySelector('ids-icon');

    loop = icon.rl;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    loop = null;
  });

  it('sets up with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    iconEl.remove();
    iconEl = new IdsIcon();
    document.body.appendChild(iconEl);
    expect(document.querySelectorAll('ids-icon').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('sets up globals', () => {
    expect(loop).toBeDefined();
  });

  it('can create an `IdsRenderLoopItem` that eventually times out', (done) => {
    let flag = false;
    const timeoutCallback = jest.fn(() => {
      flag = true;
    });

    const item = new IdsRenderLoopItem({
      duration: 200,
      timeoutCallback
    });
    loop.register(item);

    setTimeout(() => {
      expect(timeoutCallback.mock.calls.length).toBe(1);
      expect(flag).toBeTruthy();
      done();
    }, 300);
  });

  it('can create an `IdsRenderLoopItem` that updates indefinitely', (done) => {
    let count = 0;
    let removed = false;
    const timeoutCallback = jest.fn(() => {
      removed = true;
    });
    const updateCallback = jest.fn(() => {
      count++;
    });

    const item = new IdsRenderLoopItem({
      id: 'test-loop-item',
      duration: -1,
      timeoutCallback,
      updateDuration: 50,
      updateCallback
    });
    loop.register(item);

    // By the time we get to 300ms the loop should have been called
    // at least 5 times (IdsRenderLoop timing now matches `setTimeout`)
    setTimeout(() => {
      expect(updateCallback.mock.calls.length).toBeGreaterThan(3);
      expect(count).toBeGreaterThan(3);

      // Removes the item from the loop when we're done.
      // Removing via the RenderLoop API (as opposed to the RenderLoopItem API) causes the
      // timeout callback to fire if its defined.
      loop.remove(item);

      setTimeout(() => {
        expect(removed).toBeTruthy();
        done();
      }, 10);
    }, 300);
  });

  describe('Ids RenderLoop Item', () => {
    it('keeps time records', () => {
      let updates = 0;
      const item = new IdsRenderLoopItem({
        id: 'test-loop-item',
        duration: -1,
        updateCallback: () => {
          updates++;
        }
      });
      loop.register(item);

      expect(item.startTime).toBeDefined();
      expect(item.elapsedTime).toBeDefined();
    });

    it('can be paused and resumed', (done) => {
      let updates = 0;
      const timeoutLength = 100;
      const item = new IdsRenderLoopItem({
        id: 'test-loop-item',
        duration: -1,
        updateCallback: () => {
          updates++;
        }
      });
      loop.register(item);

      setTimeout(() => {
        item.pause();

        expect(item.lastPauseTime).toBeDefined();

        setTimeout(() => {
          item.resume();

          expect(item.totalStoppedTime).toBeGreaterThan(timeoutLength);
          done();
        }, timeoutLength);
      }, 10);
    });

    it('can be destroyed without triggering its timeout', (done) => {
      let flag = false;
      const timeoutCallback = jest.fn(() => {
        flag = true;
      });

      const item = new IdsRenderLoopItem({
        duration: 200,
        timeoutCallback
      });
      loop.register(item);

      setTimeout(() => {
        item.destroy(true);

        expect(item.doRemoveOnNextTick).toBeTruthy();

        setTimeout(() => {
          expect(flag).toBeFalsy();
          done();
        }, 10);
      }, 10);
    });
  });
});
