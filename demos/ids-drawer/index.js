import IdsDrawer from '../../src/components/ids-drawer/ids-drawer';
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsText from '../../src/components/ids-text/ids-text';

document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer = document.querySelector('#drawer-app-menu');
  const actionSheetDrawer = document.querySelector('#drawer-action-sheet');
  const appMenuTriggerBtn = document.querySelector('#app-menu-trigger');
  const actionSheetTriggerBtn = document.querySelector('#action-sheet-trigger');

  appMenuDrawer.target = appMenuTriggerBtn;
  appMenuTriggerBtn.addEventListener('click', () => {
    appMenuTriggerBtn.disabled = true;
  });

  actionSheetDrawer.target = actionSheetTriggerBtn;
  actionSheetTriggerBtn.addEventListener('click', () => {
    actionSheetTriggerBtn.disabled = true;
  });

  appMenuDrawer.addEventListener('hide', () => {
    appMenuTriggerBtn.disabled = false;
  });
  actionSheetDrawer.addEventListener('hide', () => {
    actionSheetTriggerBtn.disabled = false;
  });
});
