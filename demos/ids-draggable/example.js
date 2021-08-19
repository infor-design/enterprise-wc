import './example.scss';

const draggables = [...document.querySelectorAll('ids-draggable')];

draggables.forEach((d) => {
  // temporary way to test the ids-drag events

  d.addEventListener('ids-dragstart', (e) => {
    /* eslint-disable-next-line no-console */
    console.log('ids-dragstart', d, e.detail);
  });

  d.addEventListener('ids-drag', (e) => {
    /* eslint-disable-next-line no-console */
    console.log('ids-drag', d, e.detail);
  });

  d.addEventListener('ids-dragend', (e) => {
    /* eslint-disable-next-line no-console */
    console.log('ids-dragend', d, e.detail);
  });
});
