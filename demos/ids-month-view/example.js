document.addEventListener('DOMContentLoaded', () => {
  const monthView = document.querySelector('ids-month-view');

  monthView.addEventListener('selected', (e) => {
    console.info('Selection Changed', e.detail.date);
  });
});
