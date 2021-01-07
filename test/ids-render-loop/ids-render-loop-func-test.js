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
  let loop;

  beforeEach(() => {
    // Setup Icon
    icon = new IdsIcon();
    icon.setAttribute('icon', 'settings');
    document.body.appendChild(icon);

    // Setup Loop
    icon.rl = new IdsRenderLoop();
    loop = icon.rl;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    loop = null;
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

    expect(loop.items.length).toBe(1);

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

    expect(loop.items.length).toBe(1);

    // By the time we get to 300ms the loop should have been called
    // at least 5 times (IdsRenderLoop timing now matches `setTimeout`)
    setTimeout(() => {
      expect(updateCallback.mock.calls.length).toBeGreaterThan(2);
      expect(count).toBeGreaterThan(2);

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

  it('keeps time records', () => {
    expect(loop.startTime).toBeDefined();
    expect(loop.elapsedTime).toBeDefined();
  });

  it('can stop and start the loop', (done) => {
    const timeoutLength = 100;
    const item = new IdsRenderLoopItem({
      id: 'test-loop-item',
      duration: -1,
      updateCallback: () => {
      }
    });
    loop.register(item);

    setTimeout(() => {
      loop.stop();

      expect(loop.doLoop).toBeFalsy();
      expect(loop.lastStopTime).toBeDefined();
      expect(item.paused).toBeTruthy();

      setTimeout(() => {
        loop.start();

        expect(loop.resumeTime).toBeDefined();
        expect(loop.totalStoppedTime).toBeGreaterThan((timeoutLength - 1));
        done();
      }, timeoutLength);
    }, 10);
  });

  it('can remove a RenderLoop Item by using its id', (done) => {
    let flag = false;
    const testId = 'test-loop-item';
    const item = new IdsRenderLoopItem({
      id: testId,
      duration: -1,
      timeoutCallback: () => {
        flag = true;
      },
      updateCallback: () => {
      }
    });
    loop.register(item);

    // Register a second one for fun
    let flag2 = false;
    const item2 = new IdsRenderLoopItem({
      id: 'another-one',
      duration: 500,
      timeoutCallback: () => {
        flag2 = true;
      }
    });
    loop.register(item2);

    setTimeout(() => {
      const removedItem = loop.remove(testId);

      setTimeout(() => {
        // Queue should be empty and the timeout callback should have been triggered
        expect(loop.items.length).toBe(1);
        expect(flag).toBeTruthy();
        expect(flag2).toBeFalsy();
        expect(removedItem).toBeDefined();
        done();
      }, 30);
    }, 10);
  });

  // @TODO only needed for test coverage?
  it('can remove items by id that will never timeout by themselves', (done) => {
    const timeoutLength = 100;
    const item = new IdsRenderLoopItem({
      id: 'test-loop-item',
      duration: -1,
      updateCallback: () => {
      }
    });
    loop.register(item);

    setTimeout(() => {
      loop.remove(item);

      setTimeout(() => {
        expect(loop.items.length).toBe(0);
        done();
      });
    }, timeoutLength);
  });

  // ==============================================================
  //
  describe('Ids RenderLoop Item', () => {
    it('cannot have no id and no duration', () => {
      let item;
      try {
        item = new IdsRenderLoopItem();
      } catch (e) {
        expect(item).not.toBeDefined();
        expect(e).toBeDefined();
      }
    });

    it('cannot have no `timeoutCallback` and no `updateCallback` (needs one or the other)', () => {
      let item;
      try {
        item = new IdsRenderLoopItem({ id: 'test-loop-item' });
      } catch (e) {
        expect(item).not.toBeDefined();
        expect(e).toBeDefined();
      }
    });

    it('only accepts a number for an `updateDuration`', () => {
      let count = 0;
      const item = new IdsRenderLoopItem({
        id: 'test-loop-item',
        duration: -1,
        updateCallback: () => {
          count++; // eslint-disable-line
        },
        updateDuration: 'five'
      });
      loop.register(item);

      expect(item.updateDuration).toBe(1);
      expect(count).toBe(1);
    });

    it('keeps time records', () => {
      const item = new IdsRenderLoopItem({
        id: 'test-loop-item',
        duration: -1,
        updateCallback: () => {
        }
      });
      loop.register(item);

      expect(item.startTime).toBeDefined();
      expect(item.elapsedTime).toBeDefined();
    });

    it('can be paused and resumed', (done) => {
      const timeoutLength = 100;
      const item = new IdsRenderLoopItem({
        id: 'test-loop-item',
        duration: -1,
        updateCallback: () => {
        }
      });
      loop.register(item);

      setTimeout(() => {
        item.pause();

        expect(item.lastPauseTime).toBeDefined();

        setTimeout(() => {
          item.resume();

          expect(item.totalStoppedTime).toBeGreaterThan((timeoutLength - 1));
          done();
        }, timeoutLength);
      }, 10);
    });

    it('can timeout programmatically', (done) => {
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
        item.timeout();

        setTimeout(() => {
          expect(flag).toBeTruthy();
          expect(loop.items.length).toBe(1);
          done();
        }, 10);
      }, 10);
    });

    // @TODO: Only needed for coverage?
    it('can timeout programmatically (without a timeoutCallback)', (done) => {
      let count = 0;
      const item = new IdsRenderLoopItem({
        duration: 200,
        updateCallback: () => {
          count++; // eslint-disable-line
        }
      });
      loop.register(item);

      setTimeout(() => {
        item.timeout();

        setTimeout(() => {
          expect(loop.items.length).toBe(1);
          expect(count).toBe(1);
          done();
        }, 10);
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

describe('Ids RenderLoop (with Autostart)', () => {
  let icon;
  let loop;

  beforeEach(() => {
    debugger;
    // Setup Icon
    icon = new IdsIcon();
    icon.setAttribute('icon', 'settings');
    document.body.appendChild(icon);

    // Setup Loop
    icon.rl = new IdsRenderLoop({ autoStart: false });
    loop = icon.rl;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    loop = null;
  });

  it('won\'t start until it\'s told', () => {
    debugger;
    expect(loop.doLoop).toBeFalsy();
  });
});

describe('Ids RenderLoop Mixin', () => {
  it('Generates and provides access to a global RenderLoop instance', () => {
    const mixin = IdsRenderLoopMixin;
    const rl = mixin.rl;

    expect(rl).not.toBe(null);

    // @TODO only needed for coverage?
    // Compares both references to ensure they are the same.
    const otherRl = mixin.rl;

    expect(rl).toEqual(otherRl);
  });
});
