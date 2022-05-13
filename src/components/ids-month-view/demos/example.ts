document.addEventListener('DOMContentLoaded', () => {
  const monthView = document.querySelector('ids-month-view');

  monthView?.addEventListener('dayselected', (e: any) => {
    console.info('Day Selected', e.detail.date);
  });
});
