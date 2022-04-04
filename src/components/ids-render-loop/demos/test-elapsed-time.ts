// Supporting Components
import '../../ids-toggle-button/ids-toggle-button';
import IdsRenderLoopItem from '../ids-render-loop-item';
import renderLoop from '../ids-render-loop';

// When the DOM Loads, register a loop that counts durations
// of both the loop and an individual item, as well as sets up play/stop.
document.addEventListener('DOMContentLoaded', () => {
  const rlCounterEl: any = document.querySelector('#renderloop-elapsed-time');
  const rlStopCounterEl: any = document.querySelector('#renderloop-stopped-time');
  const itemCounterEl: any = document.querySelector('#item-elapsed-time');
  const itemPauseCounterEl: any = document.querySelector('#item-paused-time');

  // =================================================
  // Builds sample `IdsRenderLoopItem`s with infinite duration
  // that runs an update on each RenderLoop tick.

  // This item will update the Item Playback display, and can be paused/resumed.
  const testItem = new IdsRenderLoopItem({
    id: 'item-counter',
    duration: -1,
    updateCallback() {
      itemCounterEl.textContent = `${(this as any).elapsedTime}`;
    }
  });
  (renderLoop as any).register(testItem);

  // This item runs all the time and updates all the display values
  const loopCountItem = new IdsRenderLoopItem({
    id: 'loop-counter',
    duration: -1,
    updateCallback() {
      rlCounterEl.textContent = `${(renderLoop as any).elapsedTime}`;
      rlStopCounterEl.textContent = `${(renderLoop as any).totalStoppedTime}`;
      itemPauseCounterEl.textContent = `${(renderLoop as any).totalStoppedTime}`;
    }
  });
  (renderLoop as any).register(loopCountItem);

  // =================================================
  // Setup functionality on Playback buttons
  const loopPlaybackBtn: any = document.querySelector('#loop-playback-btn');
  const itemPlaybackBtn: any = document.querySelector('#item-playback-btn');

  loopPlaybackBtn.addEventListener('click', (e: any) => {
    const btn = e.target;
    btn.toggle();
    if (btn.pressed) {
      (renderLoop as any).start();
    } else {
      (renderLoop as any).stop();
    }
  });

  itemPlaybackBtn.addEventListener('click', (e: any) => {
    const btn = e.target;
    btn.toggle();
    if (btn.pressed) {
      testItem.resume();
    } else {
      testItem.pause();
    }
  });
});
