// Supporting components
import IdsDraggable from '../ids-draggable';
import css from '../../../assets/css/ids-draggable/ids-draggable.css';

const draggableCss = `<link href="${css}" rel="stylesheet">`
const draggables = [...document.querySelectorAll('ids-draggable')];

document.querySelector('head').insertAdjacentHTML('afterbegin', draggableCss);

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
