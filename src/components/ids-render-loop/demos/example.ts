// Access the global RenderLoop instance.
// When using the mixin on a real component, the `rl` property exists on the component instance.
import renderLoop from '../ids-render-loop-global';
import IdsRenderLoopItem from '../ids-render-loop-item';

// of both the loop and an individual item, as well as sets up play/stop.
document.addEventListener('DOMContentLoaded', () => {
  const duration = 1000;
  const countdownBtn: any = document.querySelector('#countdown-trigger-btn');
  const countdownSpan: any = document.querySelector('#renderloop-countdown');
  let timer: any;

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
        const timeLeft = (duration - (this as any).elapsedTime).toFixed(0);
        countdownSpan.textContent = `${timeLeft}`;
      },
      timeoutCallback() {
        countdownSpan.textContent = 'DONE!';
        countdownSpan.classList.add('done');
        (this as any).destroy();
      }
    });
    renderLoop.register(timer);
  });
});
