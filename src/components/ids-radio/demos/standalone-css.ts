import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import radioStyles from '../ids-radio.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import radioGroupStyles from '../ids-radio-group.scss';

appendStyleSheets(
  radioStyles,
  layoutStyles,
  textStyles,
  radioGroupStyles
);
