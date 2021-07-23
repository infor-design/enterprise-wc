// Import Every Yaml File
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
addYaml(virtualScrollYaml);
addYaml(wizardYaml);

let html = '';
categories.forEach((category) => {
  html += `<ids-text type="h1" font-size="20"><ids-icon icon="${category.icon}"></ids-icon>${category.name}</ids-text>`;
  category.components.forEach((component) => {
    html += `<ids-text type="h1" font-size="12">${component.component}</ids-text>`;
    html += `<ids-text type="h1" font-size="12">${component.description}</ids-text>`;
  });
});
document.querySelector('#dynamic-area').insertAdjacentHTML('afterbegin', html);
