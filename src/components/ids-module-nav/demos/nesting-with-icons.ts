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

let menuState: IdsModuleNavDisplayMode = 'expanded';

document.addEventListener('DOMContentLoaded', () => {
  const moduleNav: any = document.querySelector('ids-module-nav');
  const moduleNavDrawer: any = document.querySelector('ids-module-nav-bar');
  const appMenuTriggerBtn: any = document.querySelector('#module-nav-trigger');

  moduleNavDrawer.target = appMenuTriggerBtn;

  const updateDisplayMode = (val: IdsModuleNavDisplayMode) => {
    menuState = val;
    moduleNav.displayMode = val;
    console.info('Module Nav Display Mode Updated:', val || 'hidden');
  };

  // ============================
  // Setup events

  moduleNavDrawer.addEventListener('selected', (e: CustomEvent) => {
    console.info(`Module Nav Item "${(e.target as any).textContent.trim()}" was selected.`);
  });

  appMenuTriggerBtn.addEventListener('click', () => {
    updateDisplayMode(menuState === 'expanded' ? 'collapsed' : 'expanded');
  });

  // =============================
  // Set initial

  moduleNav.displayMode = menuState;
  moduleNavDrawer.filterable = true;
});
