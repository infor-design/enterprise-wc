import '../ids-dropdown';
import '../../ids-input/ids-input';
import '../../ids-list-box/ids-list-box';
import '../../ids-modal/ids-modal';
import '../../ids-list-box/ids-list-box-option';
import '../../ids-popup/ids-popup';
import '../../ids-layout-flex/ids-scroll-container';
import '../../ids-expandable-area/ids-expandable-area';
import css from '../../../assets/css/ids-popup/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

document.addEventListener('DOMContentLoaded', () => {
});
