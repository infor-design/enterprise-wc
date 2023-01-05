import '../ids-hyperlink';
import type IdsHyperlink from '../ids-hyperlink';

const link = document.querySelector<IdsHyperlink>('#link-no-href');

link?.addEventListener('click', (e) => {
  console.info('No href link has been clicked', e);
});
