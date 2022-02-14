// home page events
import IdsHomePage from '../../src/components/ids-home-page/ids-home-page';

document.addEventListener('DOMContentLoaded', () => {
  const homePage = document.querySelector('#home-page-event-resized');
  homePage?.addEventListener('resized', (e) => {
    console.log('resized: ', e.detail); // eslint-disable-line
  });
});
