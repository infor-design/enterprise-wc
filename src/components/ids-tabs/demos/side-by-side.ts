import '../../ids-text/ids-text';
import '../../ids-header/ids-header';

import '../ids-tabs';
import '../ids-tab';
import '../ids-tab-content';
import '../ids-tabs-context';
import '../ids-tab-divider';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelector('ids-tabs');

  tabs?.addEventListener('change', (e: Event | CustomEvent | any) => {
    console.info(`#${e.target?.getAttribute('id')}.on('change') =>`, e.target?.value);
  });
});
