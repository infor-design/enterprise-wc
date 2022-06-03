import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import iconStyles from '../../ids-icon/ids-icon.scss';
import treeSharedStyles from '../ids-tree-shared.scss';
import treeStyles from '../ids-tree.scss';
import treeNodeStyles from '../ids-tree-node.scss';

appendStyleSheets(
  layoutStyles,
  textStyles,
  iconStyles,
  treeSharedStyles,
  treeStyles,
  treeNodeStyles
);

document.addEventListener('DOMContentLoaded', () => {
  const treeDemo: any = document.querySelector('#tree-demo');

  if (treeDemo) {
    (async function init() {
      // On selected
      treeDemo.addEventListener('selected', (e: any) => {
        console.info('selected:', e?.detail);
      });
    }());
  }
});
