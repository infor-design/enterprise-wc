import aboutStyles from '../ids-about.scss';
import modalStyles from '../../ids-modal/ids-modal.scss';
import overlayStyles from '../../ids-modal/ids-overlay.scss';
import popupStyles from '../../ids-popup/ids-popup.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import textStyles from '../../ids-text/ids-text.scss';
import iconStyles from '../../ids-icon/ids-icon.scss';
import containerStyles from '../../ids-container/ids-container.scss';

import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import css from '../../../assets/css/ids-about/standalone-css.css';

// Ids Css
appendStyleSheets(
  aboutStyles,
  modalStyles,
  overlayStyles,
  popupStyles,
  buttonStyles,
  textStyles,
  iconStyles,
  containerStyles
);

// Custom Css
const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
