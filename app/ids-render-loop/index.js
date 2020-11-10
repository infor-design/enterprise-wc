import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../../src/ids-render-loop/ids-render-loop-mixin';

// Supporting Components
import IdsLabel from '../../src/ids-label/ids-label';
import IdsLayoutGridCell from '../../src/ids-layout-grid/ids-layout-grid-cell';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsButton from '../../src/ids-button/ids-button';

// Styles
import './index.scss';

// Access the global RenderLoop instance.
// When using the mixin on a real component, the `rl` property exists on the component instance.
const rlMixin = IdsRenderLoopMixin;
const renderLoop = rlMixin.rl;

// When the DOM Loads, register a loop that counts durations
// of both the loop and an individual item, as well as sets up play/stop.
document.addEventListener('DOMContentLoaded', () => {
  const duration = 1000;
  const countdownBtn = document.querySelector('#countdown-trigger-btn');
  const countdownSpan = document.querySelector('#renderloop-countdown');
  let timer;

  countdownBtn.addEventListener('click', () => {
    // Clear any previously-set RenderLoop items,
    // making them "destroy" without calling the Timeout function
    if (timer) {
      timer.destroy(true);
    }

    countdownSpan.classList.remove('done');

    // Create a RenderLoop item that updates a countdown number on its callback
    timer = new IdsRenderLoopItem({
      duration,
      updateCallback() {
        const timeLeft = (duration - this.elapsedTime).toFixed(0);
        countdownSpan.textContent = `${timeLeft}`;
      },
      timeoutCallback() {
        countdownSpan.textContent = 'DONE!';
        countdownSpan.classList.add('done');
        this.destroy();
      }
    });
    renderLoop.register(timer);
  });
});
