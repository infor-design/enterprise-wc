// Supporting components 
import IdsMonthView from '../ids-month-view';

document.addEventListener('DOMContentLoaded', () => {
  const monthView = document.querySelector('ids-month-view');

  monthView.addEventListener('dayselected', (e) => {
    console.info('Day Selected', e.detail.date);
  });
});
