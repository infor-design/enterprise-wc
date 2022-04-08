// Supporting components
import '../../ids-button/ids-button';
import '../../ids-icon/ids-icon';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';
import avatarPlaceholder from '../../../assets/images/avatar-placeholder.jpg';

const avatarImg: any = window.document.getElementById('avatar');
avatarImg.src = avatarPlaceholder;

document.addEventListener('DOMContentLoaded', () => {
  avatarImg.src = avatarPlaceholder;

  const appMenuDrawer: any = document.querySelector('#app-menu');
  const appMenuTriggerBtn: any = document.querySelector('#app-menu-trigger');

  appMenuDrawer.target = appMenuTriggerBtn;
  appMenuTriggerBtn.addEventListener('click', () => {
    appMenuTriggerBtn.disabled = true;
  });

  appMenuDrawer.addEventListener('hide', () => {
    appMenuTriggerBtn.disabled = false;
  });

  appMenuDrawer.addEventListener('selected', (e: any) => {
    console.info(`Header "${e.target.textContent.trim()}" was selected.`);
  });
});
