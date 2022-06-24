document.addEventListener('DOMContentLoaded', () => {
  const menuBtnEl: any = document.querySelector('ids-menu-button');

  const toggleDisabledCheck: any = document.querySelector('#toggle-disabled-menubutton');
  toggleDisabledCheck.addEventListener('change', (e: any) => {
    menuBtnEl.disabled = e.target.checked;
  });

  const forceMenuCheck: any = document.querySelector('#force-menu-show');
  const defaultOnOutsideClick = menuBtnEl.menuEl.onOutsideClick;
  forceMenuCheck.addEventListener('change', (e: any) => {
    const checked = e.target.checked;
    menuBtnEl.menuEl.keepOpen = checked;
    if (checked) {
      menuBtnEl.menuEl.show();
      menuBtnEl.menuEl.onOutsideClick = () => {};
    } else {
      menuBtnEl.menuEl.onOutsideClick = defaultOnOutsideClick;
    }
  });
});
