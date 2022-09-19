/**
 * @jest-environment jsdom
 */
import {
  clearAnimationInterval,
  clearAnimationTimeout,
  cssTransitionTimeout,
  requestAnimationInterval,
  requestAnimationTimeout,
} from '../../src/utils/ids-timer-utils/ids-timer-utils';
import type { FrameRequestLoopHandler } from '../../src/utils/ids-timer-utils/ids-timer-utils';
import wait from '../helpers/wait';
import waitForTimeout from '../helpers/wait-for-timeout';

import '../../src/components/ids-modal/ids-modal';
import '../../src/components/ids-modal-button/ids-modal-button';

describe('IdsTimerUtils tests (requestAnimationFrame)', () => {
  let el: HTMLDivElement | null;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el?.remove();
    el = null;
  });

  it('can execute functions on a timeout', async () => {
    const timeout: FrameRequestLoopHandler = await requestAnimationTimeout(() => el?.classList.add('complete'), 100);
    expect(timeout.value).toBeDefined();

    await wait(110);
    await waitForTimeout(() => expect(el?.classList).toContain('complete'));
  });

  it('can cancel a timeout function and prevent it from occuring', async () => {
    const timeout: FrameRequestLoopHandler = requestAnimationTimeout(() => el?.classList.add('complete'), 100);
    expect(timeout.value).toBeDefined();

    await wait(50);
    clearAnimationTimeout(timeout);
    await waitForTimeout(() => expect(el?.classList).not.toContain('complete'));
  });

  it('can execute functions on an interval', async () => {
    let count = 0;
    const interval: FrameRequestLoopHandler = await requestAnimationInterval(() => {
      count += 1;
    }, 50);
    expect(interval.value).toBeDefined();

    // Run at least 3 full times
    await wait(160);
    await waitForTimeout(() => expect(count).toBeGreaterThan(2));
  });

  it('can cancel an interval function and prevent it from occuring further', async () => {
    let count = 0;
    const interval: FrameRequestLoopHandler = await requestAnimationInterval(() => {
      count += 1;
    }, 50);
    expect(interval.value).toBeDefined();

    // Run at least 3 full times, clear, then wait at least one more interval
    await wait(160);
    clearAnimationInterval(interval);
    await wait(100);

    // Count should be the same as if it only ran three times
    await waitForTimeout(() => expect(count).toBeLessThan(4));
  });
});

describe('IdsTimerUtils (CSS Transitions)', () => {
  it.skip('can execute functions after a CSS transition completes', async () => {
    expect(document.querySelector('.ids-transition-timeout')).toBe(null);

    // Kickoff a timeout (don't wait for this one)
    await cssTransitionTimeout(200);

    // Hidden tested elements should be cleaned up
    expect(document.querySelector('.ids-transition-timeout')).toBe(null);
  });
});
