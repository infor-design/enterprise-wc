import css from '../../../assets/css/ids-widget/example.css';
import '../../ids-home-page/ids-home-page';
import '../../ids-list-view/ids-list-view';
import '../../ids-badge/ids-badge';
import '../../ids-layout-flex/ids-layout-flex';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}
