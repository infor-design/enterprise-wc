// Supporting components
import '../ids-button/ids-button.js';
import '../ids-icon/ids-icon.js';
import '../ids-search-field/ids-search-field.js';
import '../ids-toolbar/ids-toolbar.js';

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
