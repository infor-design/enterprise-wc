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

document.addEventListener('DOMContentLoaded', async () => {
  const moduleNav: any = document.querySelector('ids-module-nav');
  const moduleNavDrawer: any = document.querySelector('ids-module-nav-bar');
  const appMenuTriggerBtn: any = document.querySelector('#module-nav-trigger');

  moduleNavDrawer.target = appMenuTriggerBtn;

  const updateDisplayMode = (val: IdsModuleNavDisplayMode) => {
    if (menuState !== val) {
      menuState = val;
      moduleNav.displayMode = val;
      console.info('Module Nav Display Mode Updated:', val || 'hidden');
    }
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
    const alternateMode = moduleNav.isWithinMobileBreakpoint() ? false : 'collapsed';
    updateDisplayMode(menuState === 'expanded' ? alternateMode : 'expanded');
  });

  moduleNav.addEventListener('displaymodechange', (e: CustomEvent) => {
    const newMenuState = e.detail.displayMode;
    console.info('Module Nav "displaymodechange" event handled: ', newMenuState);
    if (newMenuState !== menuState) {
      updateDisplayMode(newMenuState);
    }
  });

  // =============================
  // Set initial

  moduleNav.displayMode = menuState;
  moduleNav.responsive = true;
  moduleNavDrawer.filterable = true;
  moduleNavDrawer.pinned = true;
});
