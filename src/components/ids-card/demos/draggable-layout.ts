import css from '../../../assets/css/ids-card/draggable.css';
import '../../ids-tabs/ids-tabs';
import '../../ids-search-field/ids-search-field';
import '../ids-card';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

const draggableCards = document.querySelectorAll('ids-card[draggable]')!;

draggableCards.forEach((cardEl) => {
  cardEl.addEventListener('dragstart', (e: any) => {
    cardEl.setAttribute('drag-bg-color', 'rgba(255, 255, 255, 0.80)');
  });

  cardEl.addEventListener('dragend', (e: any) => {
    cardEl.setAttribute('drop-bg-color', 'rgba(255, 255, 255, 0.80)');
  });
});
