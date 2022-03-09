import IdsInput from '../../ids-input/ids-input';
import bikesJSON from '../../../assets/data/bikes.json';
import css from '../../../assets/css/ids-tooltip/sandbox.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

// Use the syncronous `beforeshow` event to log a message
const tooltipTop = document.querySelector('[target="#tooltip-top"]');
tooltipTop.addEventListener('beforeshow', (e) => {
  console.info('beforeshow', e, e.detail);
});

const tooltipAsync = document.querySelector('[target="#tooltip-async"]');

// Use the asyncronous `beforeshow` callback to load contents
tooltipAsync.beforeShow = async function beforeShow() {
  const res = await fetch(bikesJSON);
  const data = await res.json();

  return data[1].manufacturerName;
};
