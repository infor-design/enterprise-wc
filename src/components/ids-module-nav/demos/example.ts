import '../../ids-accordion/ids-accordion';
import '../../ids-header/ids-header';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-toolbar/ids-toolbar-section';

let menuState = 'collapsed';

document.addEventListener('DOMContentLoaded', () => {
  const moduleNavDrawer: any = document.querySelector('#module-nav');
  const appMenuTriggerBtn: any = document.querySelector('#module-nav-trigger');
  moduleNavDrawer.target = appMenuTriggerBtn;

  // =============================
  // Setup events

  moduleNavDrawer.addEventListener('selected', (e: CustomEvent) => {
    console.info(`Module Nav Item "${(e.target as any).textContent.trim()}" was selected.`);
  });

  appMenuTriggerBtn.addEventListener('click', () => {
    debugger;
    menuState = menuState === 'collapsed' ? 'expanded' : 'collapsed';
    moduleNavDrawer.displayMode = menuState;
    debugger;
  });

  // =============================
  // Set initial

  moduleNavDrawer.displayMode = menuState;
});
