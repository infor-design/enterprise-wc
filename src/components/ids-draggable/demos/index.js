// Supporting components
import IdsDraggable from '../ids-draggable';

const draggables = [...document.querySelectorAll('ids-draggable')];

// add event listeners to console log the draggables;
// temporary way to document these

draggables.forEach((d) => {
  d.addEventListener('ids-dragstart', (e) => {
    console.info('ids-dragstart', d, e.detail);
  });

  d.addEventListener('ids-drag', (e) => {
    console.info('ids-drag', d, e.detail);
  });

  d.addEventListener('ids-dragend', (e) => {
    console.info('ids-dragend', d, e.detail);
  });
});
