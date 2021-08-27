import IdsAppMenu from '../../src/components/ids-app-menu';
import IdsButton from '../../src/components/ids-button';
import IdsToolbar, { IdsToolbarSection } from '../../src/components/ids-toolbar';

document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer = document.querySelector('#app-menu');
  const appMenuTriggerBtn = document.querySelector('#app-menu-trigger');

  appMenuDrawer.target = appMenuTriggerBtn;
  appMenuTriggerBtn.addEventListener('click', () => {
    appMenuTriggerBtn.disabled = true;
  });

  appMenuDrawer.addEventListener('hide', () => {
    appMenuTriggerBtn.disabled = false;
  });

  appMenuDrawer.addEventListener('selected', (e) => {
    console.info(`Header "${e.target.textContent.trim()}" was selected.`);
  });
});
