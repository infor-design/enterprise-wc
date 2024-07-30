import css from '../../../assets/css/ids-card/draggable.css';
import "../../ids-tabs/ids-tabs";
import "../../ids-search-field/ids-search-field";

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}
