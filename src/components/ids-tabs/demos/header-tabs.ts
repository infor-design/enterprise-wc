import '../../ids-text/ids-text';
import '../../ids-header/ids-header';

import '../ids-tabs';
import '../ids-tab';
import '../ids-tab-content';
import '../ids-tabs-context';
import '../ids-tab-divider';
import '../../ids-toolbar/ids-toolbar';

document.addEventListener('DOMContentLoaded', () => {
  const tabElements = [...document.querySelectorAll('ids-tabs')];

  tabElements.forEach((el) => el.addEventListener('change', (e: Event | CustomEvent | any) => {
    console.info(`ids-tabs.on('change') =>`, e.target.value);
  }));

  const tabList: any = document.querySelector('ids-tabs');
  const tabContentContainer: any = document.querySelector('ids-tabs-context');
  let newTabCount = 0;

  // If an "Add Tab" button is present, configures it to add a tab and panel
  const addTab: any = document.querySelector('ids-tab[value="add"]');
  if (addTab) {
    addTab.onAction = () => {
      addTab.insertAdjacentHTML('beforebegin', `<ids-tab color-variant="header" value="new-tab-${newTabCount}" dismissible>New Tab ${newTabCount}</ids-tab>`);
      tabContentContainer.insertAdjacentHTML('beforeend', `<ids-tab-content value="new-tab-${newTabCount}">
        <ids-layout-grid auto-fit="true" padding="sm">
          <ids-layout-grid-cell>
            <ids-text font-size="20" type="h2">New Tab #${newTabCount}</ids-text>
            <br />
            <ids-text type="p">Generated ${new Date()}</ids-text>
          </ids-layout-grid-cell>
        </ids-layout-grid>
      </ids-tab-content>`);
      newTabCount += 1;
    };
  }

  // If a "Reset Tab" button is present, configures it to remove the tab and panel
  const resetTab: any = document.querySelector('ids-tab[value="reset"]');
  if (resetTab) {
    resetTab.onAction = () => {
      [...tabList.querySelectorAll('ids-tab[value*="new-tab-"]')].forEach((tab) => {
        tab.remove();
      });
      [...tabContentContainer.querySelectorAll('ids-tab-content[value*="new-tab-"]')].forEach((panel) => {
        panel.remove();
      });
      newTabCount = 0;
    };
  }
});
