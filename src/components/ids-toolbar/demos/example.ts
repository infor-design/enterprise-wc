document.addEventListener('DOMContentLoaded', () => {
  const toolbarEl = document.querySelector('#my-toolbar');
  toolbarEl?.addEventListener('selected', (e: any) => {
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
  });
});
