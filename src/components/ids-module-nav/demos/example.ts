import '../ids-module-nav';
import '../ids-module-nav-bar';
import '../ids-module-nav-button';
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
import '../../ids-dropdown/ids-dropdown-list';
import '../../ids-header/ids-header';
import '../../ids-list-box/ids-list-box';
import '../../ids-list-box/ids-list-box-option';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-toolbar/ids-toolbar-section';

import type { IdsModuleNavDisplayMode } from '../ids-module-nav-common';

let menuState: IdsModuleNavDisplayMode = 'collapsed';

document.addEventListener('DOMContentLoaded', () => {
  const moduleNav: any = document.querySelector('ids-module-nav');
  const moduleNavDrawer: any = document.querySelector('ids-module-nav-bar');
  const moduleNavAccordion: any = document.querySelector('ids-accordion');
  const appMenuTriggerBtn: any = document.querySelector('#module-nav-trigger');
  const displayModeDropdown: any = document.querySelector('#dd-display-mode-setting');
  const accordionOnePaneCheck: any = document.querySelector('#one-accordion-pane');
  const filterableCheck: any = document.querySelector('#is-filterable');
  const pinSectionsCheck: any = document.querySelector('#pin-sections');

  moduleNavDrawer.target = appMenuTriggerBtn;

  const updateDisplayMode = (val: IdsModuleNavDisplayMode) => {
    menuState = val;
    moduleNav.displayMode = val;
    if (displayModeDropdown.value !== val) displayModeDropdown.value = val;
    console.info('Module Nav Display Mode Updated:', val || 'hidden');
  };

  // ============================
  // Setup events

  moduleNavDrawer.addEventListener('selected', (e: CustomEvent) => {
    const target = (e.target as HTMLElement);
    if (target.tagName === 'IDS-DROPDOWN') {
      console.info(`Role "${(e.detail.selectedElem as any).textContent.trim()}" was selected.`);
    }
    if (target.tagName === 'IDS-MODULE-NAV-ITEM') {
      console.info(`Module Nav Item "${(e.target as any).textContent.trim()}" was selected.`);
    }
  });

  appMenuTriggerBtn.addEventListener('click', () => {
    updateDisplayMode(menuState === 'expanded' ? 'collapsed' : 'expanded');
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
