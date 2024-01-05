import '../../ids-text/ids-text';
import '../../ids-header/ids-header';
import '../ids-tabs';

document.addEventListener('DOMContentLoaded', () => {
  const tabElements = [...document.querySelectorAll('ids-tabs')];

  tabElements.forEach((el) => el.addEventListener('change', (e: Event | CustomEvent | any) => {
    console.info(`ids-tabs.on('change') =>`, e.target?.value);
  }));
});
