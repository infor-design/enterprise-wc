import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import pagerStyles from '../ids-pager.scss';
import pagerButtonStyles from '../ids-pager-button.scss';
import pagerInputStyles from '../ids-pager-input.scss';

import buttonStyles from '../../ids-button/ids-button.scss';
import iconStyles from '../../ids-icon/ids-icon.scss';
import inputStyles from '../../ids-input/ids-input.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';

appendStyleSheets(
  buttonStyles,
  iconStyles,
  inputStyles,
  layoutStyles,
  textStyles,
  pagerStyles,
  pagerButtonStyles,
  pagerInputStyles
);
