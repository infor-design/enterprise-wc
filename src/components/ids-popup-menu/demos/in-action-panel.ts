import '../../ids-menu-button/ids-menu-button';
import '../../ids-input/ids-input';
import '../../ids-list-box/ids-list-box';
import '../../ids-list-box/ids-list-box-option';
import '../../ids-popup/ids-popup';
import '../../ids-layout-flex/ids-scroll-container';
import '../../ids-action-panel/ids-action-panel';
import type IdsActionPanel from '../../ids-action-panel/ids-action-panel';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const actionPanel = document.querySelector<IdsActionPanel>('ids-action-panel');

  // Toggle action panel
  triggerBtn?.addEventListener('click', async () => {
    await actionPanel?.show();
  });
});
