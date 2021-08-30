import IdsAppMenu from '../../src/components/ids-app-menu';
import IdsAccordion from '../../src/components/ids-accordion';
import IdsButton from '../../src/components/ids-button';
import IdsIcon from '../../src/components/ids-icon';
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
