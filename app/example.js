// Import Every Yaml File

import textYaml from './ids-text/index.yaml';
import themeSwitcherButtonYaml from './ids-theme-switcher/index.yaml';
import toggleButtonYaml from './ids-toggle-button/index.yaml';
import toolbarYaml from './ids-toolbar/index.yaml';
import tooltipYaml from './ids-tooltip/index.yaml';
import triggerFieldYaml from './ids-trigger-field/index.yaml';
import uploadYaml from './ids-upload/index.yaml';
import uploadAdvancedYaml from './ids-upload-advanced/index.yaml';
import wizardYaml from './ids-wizard/index.yaml';
import virtualScrollYaml from './ids-virtual-scroll/index.yaml';

// Import Styles
import './example.scss';

// Render Page
const categories = [
  { name: 'Form Inputs', icon: 'display', components: [] },
  { name: 'Navigation and Interaction', icon: 'map', components: [] },
  { name: 'Messages and Alerts', icon: 'success', components: [] },
  { name: 'Lists', icon: 'spreadsheet', components: [] },
  { name: 'Layouts', icon: 'project', components: [] },
  { name: 'Patterns', icon: 'design-mode', components: [] },
  { name: 'Charts and Visualizations', icon: 'line-bar-chart', components: [] }
];

const addYaml = (yaml) => {
  const index = categories.findIndex((element) => element.name === yaml.category);
  categories[index].components.push(yaml);
};

// Add each yaml file
addYaml(textYaml);
addYaml(themeSwitcherButtonYaml);
addYaml(toggleButtonYaml);
addYaml(toolbarYaml);
addYaml(tooltipYaml);
addYaml(triggerFieldYaml);
addYaml(uploadYaml);
addYaml(uploadAdvancedYaml);
addYaml(virtualScrollYaml);
addYaml(wizardYaml);

let html = '';
categories.forEach((category) => {
  html += `<ids-text type="h1" font-size="20"><ids-icon icon="${category.icon}"></ids-icon>${category.name}</ids-text>
  <ids-layout-grid cols="5" gap="md">`;
  category.components.forEach((component) => {
    html += `<ids-layout-grid-cell><ids-card auto-height="true"><div slot="card-content" link="${component.link}">
    <ids-text type="h2" font-size="16" font-weight="bold" color="slate-100">${component.component}</ids-text>
    <ids-text type="h2" font-size="16" color="slate-60">${component.description}</ids-text>
    </div></ids-layout-grid-cell></ids-card>
    `;
  });
  html += `</ids-layout-grid>`;
});
document.querySelector('#dynamic-area').insertAdjacentHTML('afterbegin', html);

// Handle Clicking Links
document.addEventListener('click', (event) => {
  const target = event.target.closest('[slot="card-content"]');
  if (target) {
    window.location.href = `/${target.getAttribute('link')}`;
  }
});
