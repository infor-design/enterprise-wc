// Supporting components
import '../ids-month-view';

const monthView: null | Element = document.querySelector('ids-month-view');

if (monthView) {
  monthView.addEventListener('dayselected', (e: any) => {
    console.info('Day Selected', e.detail);
  });
}
