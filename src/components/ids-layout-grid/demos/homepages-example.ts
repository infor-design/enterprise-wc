import '../../ids-masthead/ids-masthead';
import '../../ids-header/ids-header';
import css from '../../../assets/css/ids-layout-grid/homepages-example.css';

const mediaQueryMd = window.matchMedia('(max-width: 1546px)');
const gridCell2: any = document.getElementById('grid-cell-2');

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

mediaQueryMd.addEventListener('change', () => {
  if (mediaQueryMd.matches) {
    gridCell2.order = '-1';
  } else {
    gridCell2.order = 'revert';
  }
});
