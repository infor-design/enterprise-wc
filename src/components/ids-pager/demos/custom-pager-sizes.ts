import IdsPager from '../ids-pager';

document.addEventListener('DOMContentLoaded', () => {
  const pager = document.body.querySelector<IdsPager>('ids-pager')!;
  pager.pageSizes = [10, 20, 30, 50];
});
