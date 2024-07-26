import css from '../../../assets/css/ids-card/draggable.css';
import "../../ids-tabs/ids-tabs";
import "../../ids-search-field/ids-search-field";

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

const formIcons = {
  form: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="3" width="15" height="6" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    <rect x="3" y="13" width="26" height="6" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    <rect x="24" y="14" width="4" height="4" fill="#E0E0E1"/>
    <path d="M23.5 14.5V17.5" stroke="#161618" stroke-linecap="square"/>
    <rect x="3" y="23" width="19" height="6" rx="3" fill="#E0E0E1" stroke="#161618" stroke-width="2"/>
    <rect x="22" y="3" width="7" height="6" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    </svg>`,
  datagrid: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="3" width="26" height="26" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    <rect x="4" y="4" width="24" height="4" fill="#E0E0E1"/>
    <path d="M4 8.5H28" stroke="#161618" stroke-linecap="round"/>
    <path d="M4.5 13.5H27.5" stroke="#161618" stroke-linecap="square"/>
    <path d="M4.5 18.5H27.5" stroke="#161618" stroke-linecap="square"/>
    <path d="M4.5 23.5H27.5" stroke="#161618" stroke-linecap="square"/>
    <path d="M10.5 4.5V29" stroke="#161618" stroke-linecap="square"/>
    <path d="M16.5 4.3562V29" stroke="#161618" stroke-linecap="square"/>
    </svg>`,
  header: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M1 12H31V28C31 29.1046 30.1046 30 29 30H3C1.89543 30 1 29.1046 1 28V12Z" fill="white"/>
    <path d="M2 12V28C2 28.5523 2.44772 29 3 29H29C29.5523 29 30 28.5523 30 28V12" stroke="black" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M2 4C2 3.44772 2.44772 3 3 3H29C29.5523 3 30 3.44772 30 4V11H2V4Z" fill="#F5F5F5" stroke="#161618" stroke-width="2"/>
    <path d="M6 7H23" stroke="#161618" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  input: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="13" width="26" height="6" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    <path d="M4 10H25" stroke="#161618" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  dropdown: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="13" width="26" height="6" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    <path d="M4 10H25" stroke="#161618" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  textarea: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="9" width="26" height="18" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    <path d="M4 5H25" stroke="#161618" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  radio: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="12" width="8" height="8" rx="4" fill="white" stroke="#161618" stroke-width="2"/>
    <rect x="6" y="14" width="4" height="4" rx="2" fill="#161618"/>
    <path d="M16 16H28" stroke="#161618" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  checkbox: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="12" width="8" height="8" rx="1" fill="white" stroke="#161618" stroke-width="2"/>
    <path d="M16 16H28" stroke="#161618" stroke-width="2" stroke-linecap="round"/>
    <path d="M6.5 16L7.5 17L9.5 15" stroke="#161618" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  button: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="13" width="24" height="6" rx="3" fill="#E0E0E1" stroke="#161618" stroke-width="2"/>
    <path d="M11 16H21" stroke="#161618" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
}

const containers = [
  {
    label: 'Form',
    icon : formIcons.form,
  },
  {
    label: 'Datagrid',
    icon : formIcons.datagrid,
  }
];

const components = [
  {
    label: 'Header',
    icon : formIcons.header,
  },
  {
    label: 'Input',
    icon : formIcons.input,
  },
  {
    label: 'Dropdown',
    icon : formIcons.dropdown,
  },
  {
    label: 'Textarea',
    icon : formIcons.textarea,
  },
  {
    label: 'Radio',
    icon : formIcons.radio,
  },
  {
    label: 'Checkbox',
    icon : formIcons.checkbox,
  },
  {
    label: 'Button',
    icon : formIcons.button,
  }
];

const leftPanelContainers = document.querySelector('.panel-left-containers')!;
const leftPanelComponents = document.querySelector('.panel-left-components')!;

const createComponent = (component: any, width: string = '100%') => {
  const cardEl = document.createElement('ids-card');

  cardEl.setAttribute('draggable', 'true');
  cardEl.setAttribute('background-color', '#F5F5F5');
  cardEl.setAttribute('width', width);
  cardEl.classList.add('demo-draggable-card');

  cardEl.innerHTML = `
    <div slot="icon">${component.icon}</div>
    <div slot="label">${component.label}</div>
  `;
  return cardEl;
}

containers.forEach((item) => {
  const componentEl = createComponent(item);
  leftPanelContainers.appendChild(componentEl);
});

components.forEach((item) => {
  const componentEl = createComponent(item);
  leftPanelComponents.appendChild(componentEl);
});
