import '../../ids-header/ids-header';
import '../../ids-toolbar/ids-toolbar';

document.addEventListener('DOMContentLoaded', () => {
  const tabContentContainer: any = document.querySelector('div.ids-tabs-content');

  let newTabCount = 0;

  // Add an `onSelect` callback to the Add Button
  const addBtn: any = document.querySelector('ids-tab[value="add"]');
  addBtn.onAction = () => {
    console.log(`Add New Tab ${newTabCount}`);
    addBtn.insertAdjacentHTML('beforebegin', `<ids-tab color-variant="module" value="new-tab-${newTabCount}">New Tab ${newTabCount}</ids-tab>`);
    tabContentContainer.insertAdjacentHTML('beforeend', `<ids-tab-content value="new-tab-${newTabCount}"></ids-tab-content>`);
    newTabCount += 1;
  };
});
