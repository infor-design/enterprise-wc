import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import uploadStyles from '../ids-upload.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import iconStyles from '../../ids-icon/ids-icon.scss';
import inputStyles from '../../ids-input/ids-input.scss';
import triggerFieldStyles from '../../ids-trigger-field/ids-trigger-field.scss';
import triggerButtonStyles from '../../ids-trigger-field/ids-trigger-button.scss';

appendStyleSheets(
  uploadStyles,
  layoutStyles,
  textStyles,
  iconStyles,
  inputStyles,
  triggerFieldStyles,
  triggerButtonStyles
);
