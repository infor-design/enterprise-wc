import IdsDrawer from '../../src/ids-drawer';
import IdsButton from '../../src/ids-button/ids-button';
import IdsText from '../../src/ids-text/ids-text';

document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer = document.querySelector('#drawer-app-menu');
  const actionSheetDrawer = document.querySelector('#drawer-action-sheet');
  const appMenuTriggerBtn = document.querySelector('#app-menu-trigger');
  const actionSheetTriggerBtn = document.querySelector('#action-sheet-trigger');

  appMenuDrawer.target = appMenuTriggerBtn;
  appMenuTriggerBtn.addEventListener('click', () => {
    // appMenuDrawer.visible = true;
    appMenuTriggerBtn.disabled = true;
  });

  actionSheetDrawer.target = actionSheetTriggerBtn;
  actionSheetTriggerBtn.addEventListener('click', () => {
    // actionSheetDrawer.visible = true;
    actionSheetTriggerBtn.disabled = true;
  });

  appMenuDrawer.addEventListener('hide', () => {
    appMenuTriggerBtn.disabled = false;
  });
  actionSheetDrawer.addEventListener('hide', () => {
    actionSheetTriggerBtn.disabled = false;
  });
});
