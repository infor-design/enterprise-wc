import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import headerStyles from '../ids-header.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import toolbarStyles from '../../ids-toolbar/ids-toolbar.scss';
import toolbarSectionStyles from '../../ids-toolbar/ids-toolbar-section.scss';
import popupMenuStyles from '../../ids-popup-menu/ids-popup-menu.scss';
import popupStyles from '../../ids-popup/ids-popup.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import separatorStyles from '../../ids-separator/ids-separator.scss';
import menuStyles from '../../ids-menu/ids-menu.scss';
import menuGroupStyles from '../../ids-menu/ids-menu-group.scss';
import menuHeaderStyles from '../../ids-menu/ids-menu-header.scss';
import menuItemStyles from '../../ids-menu/ids-menu-item.scss';

appendStyleSheets(
  headerStyles,
  layoutStyles,
  textStyles,
  toolbarStyles,
  toolbarSectionStyles,
  popupMenuStyles,
  popupStyles,
  buttonStyles,
  separatorStyles,
  menuStyles,
  menuGroupStyles,
  menuHeaderStyles,
  menuItemStyles
);
