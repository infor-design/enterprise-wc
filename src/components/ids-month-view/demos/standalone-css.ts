import css from '../../../assets/css/ids-message/standalone-css.css';
import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import monthViewStyles from '../ids-month-view.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';

import buttonStyles from '../../ids-button/ids-button.scss';
import toolbarStyles from '../../ids-toolbar/ids-toolbar.scss';
import toolbarSectionStyles from '../../ids-toolbar/ids-toolbar-section.scss';

appendStyleSheets(
  monthViewStyles,
  layoutStyles,
  buttonStyles,
  textStyles,
  toolbarStyles,
  toolbarSectionStyles
);

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
