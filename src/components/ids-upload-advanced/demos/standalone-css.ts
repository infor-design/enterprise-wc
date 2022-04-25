import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import uploadAdvancedStyles from '../ids-upload-advanced.scss';
import uploadAdvancedFileStyles from '../ids-upload-advanced-file.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import idsHyperlinkStyles from '../../ids-hyperlink/ids-hyperlink.scss';
import iconStyles from '../../ids-icon/ids-icon.scss';
import alertStyles from '../../ids-alert/ids-alert.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import toolbarStyles from '../../ids-toolbar/ids-toolbar.scss';
import toolbarSectionStyles from '../../ids-toolbar/ids-toolbar-section.scss';
import progressBarStyles from '../../ids-progress-bar/ids-progress-bar.scss';

appendStyleSheets(
  uploadAdvancedStyles,
  uploadAdvancedFileStyles,
  layoutStyles,
  textStyles,
  idsHyperlinkStyles,
  iconStyles,
  alertStyles,
  buttonStyles,
  toolbarStyles,
  toolbarSectionStyles,
  progressBarStyles
);
