import css from '../../../assets/css/ids-notification-banner/standalone-css.css';
import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import hyperlinkStyles from '../../ids-hyperlink/ids-hyperlink.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import notificationBannerStyles from '../ids-notification-banner.scss';
import buttonStyles from '../../ids-button/ids-button.scss';
import iconStyles from '../../ids-icon/ids-icon.scss';
import alertStyles from '../../ids-alert/ids-alert.scss';

appendStyleSheets(
  hyperlinkStyles,
  layoutStyles,
  textStyles,
  buttonStyles,
  iconStyles,
  alertStyles,
  notificationBannerStyles,
);

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);
