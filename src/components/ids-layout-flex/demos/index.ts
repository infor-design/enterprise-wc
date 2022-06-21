// Supporting components
import '../../ids-layout-grid/ids-layout-grid';
import '../ids-layout-flex';

import css from '../../../assets/css/ids-layout-flex/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}
