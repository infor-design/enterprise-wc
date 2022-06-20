import { appendStyleSheets } from '../../../../scripts/append-stylesheets';

import layoutFlexStyles from '../ids-layout-flex.scss';
import layoutGridStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';

import css from '../../../assets/css/ids-layout-flex/index.css';

appendStyleSheets(
  layoutFlexStyles,
  layoutGridStyles,
  textStyles
);

// Custom Css
const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
