import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import listViewStyles from '../ids-list-view.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import cardStyles from '../../ids-card/ids-card.scss';
import textStyles from '../../ids-text/ids-text.scss';

appendStyleSheets(
  listViewStyles,
  layoutStyles,
  textStyles,
  cardStyles
);
