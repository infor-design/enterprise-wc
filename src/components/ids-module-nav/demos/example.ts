// Add custom Module Nav icon data
import customIconJSON from '../ids-module-nav-icon-data.json';

import '../ids-module-nav';
import '../ids-module-nav-bar';
import '../ids-module-nav-content';
import '../ids-module-nav-item';
import '../ids-module-nav-settings';
import '../ids-module-nav-switcher';

import '../../ids-accordion/ids-accordion';
import '../../ids-accordion/ids-accordion-section';
import '../../ids-accordion/ids-accordion-header';
import '../../ids-accordion/ids-accordion-panel';
import '../../ids-button/ids-button';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-header/ids-header';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-toolbar/ids-toolbar-section';

import IdsIcon from '../../ids-icon/ids-icon';

import type { IdsModuleNavDisplayMode } from '../ids-module-nav-common';

let menuState: IdsModuleNavDisplayMode = 'collapsed';

(async function initIcons() {
  const url: any = customIconJSON;
  const res = await fetch(url);
  const customIconData = await res.json();
  IdsIcon.customIconData = customIconData;
}());

document.addEventListener('DOMContentLoaded', () => {
  const moduleNav: any = document.querySelector('ids-module-nav');
  const moduleNavDrawer: any = document.querySelector('ids-module-nav-bar');
  const moduleNavAccordion: any = document.querySelector('ids-accordion');
  // const moduleNavSwitcher: any = document.querySelector('ids-module-nav-switcher');
  const appMenuTriggerBtn: any = document.querySelector('#module-nav-trigger');
  const displayModeDropdown: any = document.querySelector('#dd-display-mode-setting');
  const accordionOnePaneCheck: any = document.querySelector('#one-accordion-pane');
  const filterableCheck: any = document.querySelector('#is-filterable');
  const pinSectionsCheck: any = document.querySelector('#pin-sections');

  moduleNavDrawer.target = appMenuTriggerBtn;

  const updateDisplayMode = (val: IdsModuleNavDisplayMode) => {
    menuState = val === 'collapsed' ? 'expanded' : 'collapsed';
    moduleNav.displayMode = val;
    if (displayModeDropdown.value !== val) displayModeDropdown.value = val;
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

  accordionOnePaneCheck.addEventListener('change', (e: CustomEvent) => {
    moduleNavAccordion.allowOnePane = e.detail.checked;
  });

  displayModeDropdown.addEventListener('change', (e: CustomEvent) => {
    const selectedValue = e.detail.value;
    updateDisplayMode(selectedValue);
  });

  filterableCheck.addEventListener('change', (e: CustomEvent) => {
    moduleNavDrawer.filterable = e.detail.checked;
  });

  pinSectionsCheck.addEventListener('change', (e: CustomEvent) => {
    moduleNavDrawer.pinned = e.detail.checked;
  });

  // =============================
  // Set initial

  moduleNav.displayMode = menuState;
  moduleNavDrawer.filterable = true;
});
