// Supporting components
import IdsAppMenu from '../ids-app-menu';
import IdsBlockGrid from '../../ids-block-grid/ids-block-grid';
import IdsCard from '../../ids-card/ids-card';
import IdsButtom from '../../ids-button/ids-button';
import IdsIcon from '../../ids-icon/ids-icon';
import IdsSearchField from '../../ids-search-field/ids-search-field';
import IdsToolbar from '../../ids-toolbar/ids-toolbar';
import avatarPlaceholder from '../../../assets/images/avatar-placeholder.jpg';

const avatarImg = window.document.getElementById('avatar');
avatarImg.src = avatarPlaceholder;

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
