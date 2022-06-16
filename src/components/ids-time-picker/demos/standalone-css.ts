import css from '../../../assets/css/ids-time-picker/standalone-css.css';
import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import timePickerStyles from '../ids-time-picker.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import inputStyles from '../../ids-input/ids-input.scss';
import triggerFieldStyles from '../../ids-trigger-field/ids-trigger-field.scss';
import triggerBtnStyles from '../../ids-trigger-field/ids-trigger-button.scss';
import popupStyles from '../../ids-popup/ids-popup.scss';

appendStyleSheets(
  timePickerStyles,
  layoutStyles,
  textStyles,
  buttonStyles,
  inputStyles,
  triggerFieldStyles,
  triggerBtnStyles,
  popupStyles
);

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);
