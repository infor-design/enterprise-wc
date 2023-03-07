import { appendStyleSheets } from '../../../../scripts/append-stylesheets';

import layoutGridStyles from '../ids-layout-grid.scss';
import layoutGridCellStyles from '../ids-layout-grid-cell.scss';
import textStyles from '../../ids-text/ids-text.scss';

import css from '../../../assets/css/ids-layout-grid/grid.css';

appendStyleSheets(
  layoutGridStyles,
  layoutGridCellStyles,
  textStyles
);

// Custom Css
const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
