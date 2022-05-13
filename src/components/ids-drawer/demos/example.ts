document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer: any = document.querySelector('#drawer-app-menu');
  const actionSheetDrawer: any = document.querySelector('#drawer-action-sheet');
  const appMenuTriggerBtn: any = document.querySelector('#app-menu-trigger');
  const actionSheetTriggerBtn: any = document.querySelector('#action-sheet-trigger');

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
