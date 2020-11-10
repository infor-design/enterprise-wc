import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../../src/ids-render-loop/ids-render-loop-mixin';

// Supporting Components
import IdsPopup from '../../src/ids-popup/ids-popup';
import IdsLabel from '../../src/ids-label/ids-label';
import IdsButton from '../../src/ids-button/ids-button';

// Styles
import './test-flying-popup.scss';

// Access the global RenderLoop instance.
// When using the mixin on a real component, the `rl` property exists on the component instance.
const rlMixin = IdsRenderLoopMixin;
const renderLoop = rlMixin.rl;

// Setup functionality on page load
document.addEventListener('DOMContentLoaded', () => {
  const alignTargets = Array.from(document.querySelectorAll('.align-target'));
  let currentTarget = alignTargets[0];
  const popup = document.querySelector('ids-popup');
  const countdownEl = document.querySelector('#renderloop-countdown');
  const shiftDuration = 1000;
  let timer;

  // Takes a "current" alignment target and figures out the next one
  function getNextTarget(target) {
    let newIndex = alignTargets.indexOf(target) + 1;
    if (newIndex >= alignTargets.length) {
      newIndex = 0;
    }
    return alignTargets[newIndex];
  }

  // Create a RenderLoopItem that constantly updates the timer that displays
  // the countdown until the next target change.
  function generateTimer() {
    if (timer) {
      timer.destroy(true);
    }
    timer = new IdsRenderLoopItem({
      duration: shiftDuration,
      id: 'timer-update',
      updateCallback() {
        countdownEl.textContent = `${(shiftDuration - this.elapsedTime).toFixed(0)}`;
      }
    });
    renderLoop.register(timer);
  }
  // Generate the first one to kick it off
  generateTimer();

  // Create a RenderLoopItem with infinite duration that runs its update callback
  // every 1s.  The callback causes the Popup to float to its next target.
  const popupMover = new IdsRenderLoopItem({
    duration: -1,
    id: 'popup-mover',
    updateDuration: shiftDuration,
    updateCallback() {
      // Change the target
      currentTarget = getNextTarget(currentTarget);
      popup.alignTarget = `#${currentTarget.id}`;
      generateTimer();
    }
  });
  renderLoop.register(popupMover);
});
