import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import tooltipStyles from '../ids-tooltip.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import popupStyles from '../../ids-popup/ids-popup.scss';

import css from '../../../assets/css/ids-tooltip/standalone-css.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

appendStyleSheets(
  tooltipStyles,
  layoutStyles,
  textStyles,
  popupStyles
);
