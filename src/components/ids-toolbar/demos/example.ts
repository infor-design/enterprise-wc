import type IdsToolbar from '../ids-toolbar';

document.addEventListener('DOMContentLoaded', () => {
  const toolbarEl = document.querySelector<IdsToolbar>('#my-toolbar');
  toolbarEl?.addEventListener('selected', ((e: CustomEvent) => {
    const elem = e.detail.elem;

    let type;
    switch (elem.tagName.toLowerCase()) {
      case 'ids-menu-item':
        type = 'Menu Item';
        break;
      case 'ids-menu-button':
        type = 'Menu Button';
        break;
      case 'ids-button':
        type = 'Button';
        break;
      default: // Catch all for anything "off"
        type = elem.tagName.toLowerCase();
        break;
    }

    const consoleArgs = [
      `${type} "${elem.text.trim()}" selected. ${e.detail.triggeredFromOverflow ? '(originated from Overflow Item)' : ''}`
    ];
    if (e.detail.triggeredFromOverflow) {
      consoleArgs.push(e.detail.overflowMenuItem);
    }

    console.info(...consoleArgs);
  }) as EventListener);
});
