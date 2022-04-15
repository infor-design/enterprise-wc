import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import toolbarStyles from '../ids-toolbar.scss';
import toolbarSectionStyles from '../ids-toolbar-section.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import popupMenuStyles from '../../ids-popup-menu/ids-popup-menu.scss';
import popupStyles from '../../ids-popup/ids-popup.scss';
import menuGroupStyles from '../../ids-menu/ids-menu-group.scss';
import menuHeaderStyles from '../../ids-menu/ids-menu-header.scss';
import menuItemStyles from '../../ids-menu/ids-menu-item.scss';
import separatorStyles from '../../ids-separator/ids-separator.scss';

appendStyleSheets(
  toolbarStyles,
  toolbarSectionStyles,
  layoutStyles,
  textStyles,
  buttonStyles,
  popupMenuStyles,
  popupStyles,
  menuGroupStyles,
  menuHeaderStyles,
  menuItemStyles,
  separatorStyles
);
