import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import fieldsetStyles from '../ids-fieldset.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import inputStyles from '../../ids-input/ids-input.scss';
import buttonStyles from '../../ids-button/ids-button.scss';

appendStyleSheets(fieldsetStyles, layoutStyles, textStyles, inputStyles, buttonStyles);
