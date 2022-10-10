// Supporting components
import '../../ids-card/ids-card';
import '../../ids-popup-menu/ids-popup-menu';
import '../../ids-menu-button/ids-menu-button';
import '../ids-layout-grid';

import '../../ids-masthead/ids-masthead';
import '../../ids-header/ids-header';

import css from '../../../assets/css/ids-layout-grid/masonry.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}
