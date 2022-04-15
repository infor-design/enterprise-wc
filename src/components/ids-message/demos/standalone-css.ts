import css from '../../../assets/css/ids-message/standalone-css.css';
import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import messsageStyles from '../ids-message.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import modalStyles from '../../ids-modal/ids-modal.scss';
import textStyles from '../../ids-text/ids-text.scss';
import overlayStyles from '../../ids-modal/ids-overlay.scss';
import popupStyles from '../../ids-popup/ids-popup.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import iconStyles from '../../ids-icon/ids-icon.scss';

appendStyleSheets(
  messsageStyles,
  layoutStyles,
  textStyles,
  modalStyles,
  overlayStyles,
  popupStyles,
  buttonStyles,
  iconStyles
);

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
