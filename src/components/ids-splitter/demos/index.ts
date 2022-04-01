import '../ids-splitter';
import css from '../../../assets/css/ids-splitter/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
