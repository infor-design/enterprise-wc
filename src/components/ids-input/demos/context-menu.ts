// Supporting components
import '../../ids-popup-menu/ids-popup-menu';
import '../../ids-popup/ids-popup';

// Example for populating the Popup Menu
const popupmenuEl: any = document.querySelector('#popupmenu');

if (popupmenuEl) {
  // Standard menu configuration
  document.addEventListener('DOMContentLoaded', () => {
    popupmenuEl.addEventListener('selected', (e: any) => {
      console.info(`Item "${e.detail.elem.text}" was selected`);
    });
  });

  // Hack for now
  requestAnimationFrame(() => {
    popupmenuEl.target = (document.querySelector('#context-menu') as any)?.container.querySelector('input');
  });
}
