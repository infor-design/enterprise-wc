import '../ids-layout-grid';
import '../ids-layout-grid-cell';

// Supporting components
import '../../ids-masthead/ids-masthead';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-header/ids-header';
import '../../ids-card/ids-card';
import '../../ids-toggle-button/ids-toggle-button';

import css from '../../../assets/css/ids-grid/grid.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}
