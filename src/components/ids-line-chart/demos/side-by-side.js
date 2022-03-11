import componentsJSON from '../../../assets/data/components.json';
import css from '../../../assets/css/ids-line-chart/standalone-css.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

// Init Web Components
let data = [];

const setData = async () => {
  const res = await fetch(componentsJSON);
  data = await res.json();

  document.querySelector('ids-line-chart').data = data;

  // Init 4.x
  document.querySelector('ids-container').removeAttribute('hidden');
  $('#line-example').chart({ type: 'line', dataset: data, yAxis: { ticks: { number: 10, format: 's' } } });
};

setData();
