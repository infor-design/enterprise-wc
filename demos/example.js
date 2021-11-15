// Import Every Yaml File
import accordionYaml from './ids-accordion/index.yaml';
import actionSheetYaml from './ids-action-sheet/index.yaml';
import aboutYaml from './ids-about/index.yaml';
import alertYaml from './ids-alert/index.yaml';
import appMenuYaml from './ids-app-menu/index.yaml';
import badgeYaml from './ids-badge/index.yaml';
import blockGridYaml from './ids-block-grid/index.yaml';
import breadcrumbYaml from './ids-breadcrumb/index.yaml';
import buttonYaml from './ids-button/index.yaml';
import cardYaml from './ids-card/index.yaml';
import checkboxYaml from './ids-checkbox/index.yaml';
import colorYaml from './ids-color/index.yaml';
import colorPickerYaml from './ids-color-picker/index.yaml';
import countsYaml from './ids-counts/index.yaml';
import dataGridYaml from './ids-data-grid/index.yaml';
import draggableYaml from './ids-draggable/index.yaml';
import dropdownYaml from './ids-dropdown/index.yaml';
import expandableAreaYaml from './ids-expandable-area/index.yaml';
import fieldsetYaml from './ids-fieldset/index.yaml';
import hierarchyYaml from './ids-hierarchy/index.yaml';
import homePageYaml from './ids-home-page/index.yaml';
import hyperlinkYaml from './ids-hyperlink/index.yaml';
import iconYaml from './ids-icon/index.yaml';
import inputYaml from './ids-input/index.yaml';
import imageYaml from './ids-image/index.yaml';
import layoutGridYaml from './ids-list-view/index.yaml';
import listviewYaml from './ids-layout-grid/index.yaml';
import loadingIndicatorYaml from './ids-loading-indicator/index.yaml';
import maskYaml from './ids-mask/index.yaml';
import menuYaml from './ids-menu/index.yaml';
import menuButtonYaml from './ids-menu-button/index.yaml';
import modalYaml from './ids-modal/index.yaml';
import pagerYaml from './ids-pager/index.yaml';
import popupYaml from './ids-popup/index.yaml';
import popupMenuYaml from './ids-popup-menu/index.yaml';
import progressBarYaml from './ids-progress-bar/index.yaml';
import progressChartYaml from './ids-progress-chart/index.yaml';
import radioYaml from './ids-radio/index.yaml';
import ratingYaml from './ids-rating/index.yaml';
import scrollViewYaml from './ids-scroll-view/index.yaml';
import searchFieldYaml from './ids-search-field/index.yaml';
import skiplinkActionYaml from './ids-skip-link/index.yaml';
import sliderYaml from './ids-slider/index.yaml';
import splitterYaml from './ids-splitter/index.yaml';
import spinboxActionYaml from './ids-spinbox/index.yaml';
import swipeActionYaml from './ids-swipe-action/index.yaml';
import switchYaml from './ids-switch/index.yaml';
import tabsYaml from './ids-tabs/index.yaml';
import tagYaml from './ids-tag/index.yaml';
import textYaml from './ids-text/index.yaml';
import themeSwitcherButtonYaml from './ids-theme-switcher/index.yaml';
import toggleButtonYaml from './ids-toggle-button/index.yaml';
import toolbarYaml from './ids-toolbar/index.yaml';
import tooltipYaml from './ids-tooltip/index.yaml';
import toastYaml from './ids-toast/index.yaml';
import treeYaml from './ids-tree/index.yaml';
import triggerFieldYaml from './ids-trigger-field/index.yaml';
import uploadYaml from './ids-upload/index.yaml';
import uploadAdvancedYaml from './ids-upload-advanced/index.yaml';
import wizardYaml from './ids-wizard/index.yaml';
import virtualScrollYaml from './ids-virtual-scroll/index.yaml';
import typographyYaml from './typography/index.yaml';

// Import Styles
import './example.scss';

// Render Page
const categories = [
  { name: 'Form Inputs', icon: 'display', components: [] },
  { name: 'Navigation and Interaction', icon: 'map', components: [] },
  { name: 'Messages and Alerts', icon: 'success', components: [] },
  { name: 'Lists', icon: 'spreadsheet', components: [] },
  { name: 'Layouts', icon: 'project', components: [] },
  // { name: 'Patterns', icon: 'design-mode', components: [] },
  { name: 'Charts and Visualizations', icon: 'line-bar-chart', components: [] },
  { name: 'Typography', icon: '', components: [] },
];

const addYaml = (yaml) => {
  const index = categories.findIndex((element) => element.name === yaml.category);
  categories[index].components.push(yaml);
};

// Add each yaml file
addYaml(accordionYaml);
addYaml(actionSheetYaml);
addYaml(aboutYaml);
addYaml(alertYaml);
addYaml(appMenuYaml);
addYaml(badgeYaml);
addYaml(blockGridYaml);
addYaml(breadcrumbYaml);
addYaml(buttonYaml);
addYaml(cardYaml);
addYaml(checkboxYaml);
addYaml(colorYaml);
addYaml(colorPickerYaml);
addYaml(countsYaml);
addYaml(dataGridYaml);
addYaml(draggableYaml);
addYaml(dropdownYaml);
addYaml(expandableAreaYaml);
addYaml(fieldsetYaml);
addYaml(hierarchyYaml);
addYaml(homePageYaml);
addYaml(hyperlinkYaml);
addYaml(iconYaml);
addYaml(inputYaml);
addYaml(imageYaml);
addYaml(layoutGridYaml);
addYaml(listviewYaml);
addYaml(loadingIndicatorYaml);
addYaml(maskYaml);
addYaml(menuYaml);
addYaml(menuButtonYaml);
addYaml(modalYaml);
addYaml(pagerYaml);
addYaml(popupYaml);
addYaml(popupMenuYaml);
addYaml(progressBarYaml);
addYaml(progressChartYaml);
addYaml(radioYaml);
addYaml(ratingYaml);
addYaml(scrollViewYaml);
addYaml(searchFieldYaml);
addYaml(skiplinkActionYaml);
addYaml(sliderYaml);
addYaml(splitterYaml);
addYaml(spinboxActionYaml);
addYaml(swipeActionYaml);
addYaml(switchYaml);
addYaml(tabsYaml);
addYaml(tagYaml);
addYaml(textYaml);
addYaml(themeSwitcherButtonYaml);
addYaml(toggleButtonYaml);
addYaml(toolbarYaml);
addYaml(tooltipYaml);
addYaml(toastYaml);
addYaml(treeYaml);
addYaml(triggerFieldYaml);
addYaml(uploadYaml);
addYaml(uploadAdvancedYaml);
addYaml(virtualScrollYaml);
addYaml(wizardYaml);
addYaml(typographyYaml);

let html = '';
categories.forEach((category) => {
  html += `<ids-text type="h1" font-size="24">${category.name}</ids-text>
  <ids-layout-grid auto="true"><ids-layout-grid-cell><ids-block-grid align="center">`;
  category.components.forEach((component) => {
    html += `<ids-block-grid-item><ids-card auto-height="true"><div slot="card-content" link="${component.link}">
    <ids-text type="h2" font-size="16" font-weight="bold" color="slate-100">${component.component}</ids-text>
    <ids-text type="h2" font-size="16" color="slate-60">${component.description}</ids-text>
    </div></ids-card></ids-block-grid-item>
    `;
  });
  html += `</ids-block-grid></ids-layout-grid-cell></ids-layout-grid>`;
});
document.querySelector('#dynamic-area').insertAdjacentHTML('afterbegin', html);

// Handle Clicking Links
document.addEventListener('click', (event) => {
  const target = event.target.closest('[slot="card-content"]');
  if (target) {
    window.location.href = `/${target.getAttribute('link')}`;
  }
});
