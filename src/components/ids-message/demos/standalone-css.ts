import css from '../../../assets/css/ids-message/standalone-css.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
