// Supporting components
import '../ids-app-menu';
import '../../ids-block-grid/ids-block-grid';
import '../../ids-card/ids-card';
import '../../ids-button/ids-button';
import '../../ids-icon/ids-icon';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';
import avatarPlaceholder from '../../../assets/images/avatar-placeholder.jpg';

const avatarImg: any = window.document.getElementById('avatar');
avatarImg.src = avatarPlaceholder;

document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer: any = document.querySelector('#app-menu');
  const appMenuTriggerBtn: any = document.querySelector('#app-menu-trigger');

  appMenuDrawer.target = appMenuTriggerBtn;
  appMenuTriggerBtn.addEventListener('click', () => {
    appMenuTriggerBtn.disabled = true;
  });

  appMenuDrawer.addEventListener('hide', () => {
    appMenuTriggerBtn.disabled = false;
  });

  appMenuDrawer.addEventListener('selected', (e: CustomEvent) => {
    console.info(`Header "${(e.target as any).textContent.trim()}" was selected.`);
  });
});
