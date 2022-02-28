// Supporting Components
import IdsToggleButton from '../../ids-toggle-button/ids-toggle-button';
import IdsRenderLoopItem from '../ids-render-loop-item';
import renderLoop from '../ids-render-loop';

// When the DOM Loads, register a loop that counts durations
// of both the loop and an individual item, as well as sets up play/stop.
document.addEventListener('DOMContentLoaded', () => {
  const rlCounterEl = document.querySelector('#renderloop-elapsed-time');
  const rlStopCounterEl = document.querySelector('#renderloop-stopped-time');
  const itemCounterEl = document.querySelector('#item-elapsed-time');
  const itemPauseCounterEl = document.querySelector('#item-paused-time');

  // =================================================
  // Builds sample `IdsRenderLoopItem`s with infinite duration
  // that runs an update on each RenderLoop tick.

  // This item will update the Item Playback display, and can be paused/resumed.
  const testItem = new IdsRenderLoopItem({
    id: 'item-counter',
    duration: -1,
    updateCallback() {
      itemCounterEl.textContent = `${this.elapsedTime}`;
    }
  });
  renderLoop.register(testItem);

  // This item runs all the time and updates all the display values
  const loopCountItem = new IdsRenderLoopItem({
    id: 'loop-counter',
    duration: -1,
    updateCallback() {
      rlCounterEl.textContent = `${renderLoop.elapsedTime}`;
      rlStopCounterEl.textContent = `${renderLoop.totalStoppedTime}`;
      itemPauseCounterEl.textContent = `${testItem.totalStoppedTime}`;
    }
  });
  renderLoop.register(loopCountItem);

  // =================================================
  // Setup functionality on Playback buttons
  const loopPlaybackBtn = document.querySelector('#loop-playback-btn');
  const itemPlaybackBtn = document.querySelector('#item-playback-btn');

  loopPlaybackBtn.addEventListener('click', (e) => {
    const btn = e.target;
    btn.toggle();
    if (btn.pressed) {
      renderLoop.start();
    } else {
      renderLoop.stop();
    }
  });

  itemPlaybackBtn.addEventListener('click', (e) => {
    const btn = e.target;
    btn.toggle();
    if (btn.pressed) {
      testItem.resume();
    } else {
      testItem.pause();
    }
  });
});
