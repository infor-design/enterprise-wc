import css from '../../../assets/css/ids-card/draggable.css';
import autofit from '../../../assets/css/ids-card/auto-fit.css';
import "../../ids-tabs/ids-tabs";
import "../../ids-search-field/ids-search-field";

const cssLink = `<link href="${css}" rel="stylesheet">`;
const autoFitCssLink = `<link href="${autofit}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
  head.insertAdjacentHTML('afterbegin', autoFitCssLink);
}
