import '../../ids-accordion/ids-accordion';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-header/ids-header';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-toolbar/ids-toolbar-section';

import type { IdsModuleNavDisplayMode } from '../ids-module-nav-common';

let menuState: IdsModuleNavDisplayMode = 'collapsed';

document.addEventListener('DOMContentLoaded', () => {
  const moduleNav: any = document.querySelector('ids-module-nav');
  const moduleNavDrawer: any = document.querySelector('ids-module-nav-bar');
  const appMenuTriggerBtn: any = document.querySelector('#module-nav-trigger');
  const displayModeDropdown: any = document.querySelector('#dd-display-mode-setting');

  moduleNavDrawer.target = appMenuTriggerBtn;

  const updateDisplayMode = (val: IdsModuleNavDisplayMode) => {
    menuState = val === 'collapsed' ? 'expanded' : 'collapsed';
    moduleNav.displayMode = val;
    console.info('Module Nav Display Mode Updated:', val || 'hidden');
  };

  // ============================
  // Setup events

  moduleNavDrawer.addEventListener('selected', (e: CustomEvent) => {
    console.info(`Module Nav Item "${(e.target as any).textContent.trim()}" was selected.`);
  });

  appMenuTriggerBtn.addEventListener('click', () => {
    updateDisplayMode(menuState);
  });

  displayModeDropdown.addEventListener('change', (e: CustomEvent) => {
    const selectedValue = e.detail.value;
    updateDisplayMode(selectedValue);
  });

  // =============================
  // Set initial

  moduleNav.displayMode = menuState;
});
