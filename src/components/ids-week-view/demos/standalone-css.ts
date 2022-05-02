import css from '../../../assets/css/ids-week-view/standalone-css.css';
import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import weekViewStyles from '../ids-week-view.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import toolbarStyles from '../../ids-toolbar/ids-toolbar.scss';
import toolbarSectionStyles from '../../ids-toolbar/ids-toolbar-section.scss';

appendStyleSheets(
  weekViewStyles,
  layoutStyles,
  textStyles,
  buttonStyles,
  toolbarStyles,
  toolbarSectionStyles
);

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);
