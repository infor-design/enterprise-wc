// Supporting components
import '../ids-tabs/ids-tab.js';
import '../ids-tabs/ids-tab-content.js';
import '../ids-tabs/ids-tabs-context.js';
import '../ids-tabs/ids-tab-divider.js';

import './example.scss';

document.addEventListener('DOMContentLoaded', () => {
  const tabElements = [...document.querySelectorAll('ids-tabs')];

  tabElements.forEach((el) => el.addEventListener('change', (e) => {
    console.info(`ids-tabs.on('change') =>`, e.target.value);
  }));
});
