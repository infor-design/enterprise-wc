import css from '../../../assets/css/ids-popup-menu/position-style.css';

// Custom Css
const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
