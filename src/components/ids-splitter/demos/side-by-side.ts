import '../ids-splitter';
import css from '../../../assets/css/ids-splitter/side-by-side.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);

// Initialize the 4.x
$('body').initialize();
