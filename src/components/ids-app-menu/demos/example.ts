import '../../ids-header/ids-header';

import avatarPlaceholder from '../../../assets/images/avatar-placeholder.jpg';
import css from '../../../assets/css/ids-app-menu/example.css';

const avatarImg: any = window.document.getElementById('avatar');
avatarImg.src = avatarPlaceholder;

// Custom Css
const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);

document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer: any = document.querySelector('#app-menu');
  const appMenuTriggerBtn: any = document.querySelector('#app-menu-trigger');
  const container: any = document.querySelector('ids-container');

  appMenuTriggerBtn.addEventListener('click', (e) => {
    if (appMenuDrawer.visible) {
      appMenuDrawer.hide();
    } else {
      appMenuDrawer.show();
    }
  });

  appMenuDrawer.onOutsideClick = () => {};

  appMenuDrawer.addEventListener('show', () => {
    container.classList.add('app-menu-is-open');
  });

  appMenuDrawer.addEventListener('hide', () => {
    container.classList.remove('app-menu-is-open');
  });

  appMenuDrawer.addEventListener('selected', (e: CustomEvent) => {
    console.info(`Header "${(e.target as any).textContent.trim()}" was selected.`);
  });
});
