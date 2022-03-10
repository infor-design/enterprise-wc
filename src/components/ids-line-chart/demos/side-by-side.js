// Init Web Components
import componentsJSON from '../../../assets/data/components.json';

let data = [];

const setData = async () => {
  const res = await fetch(componentsJSON);
  data = await res.json();

  document.querySelector('ids-line-chart').data = data;

  // Init 4.x
  $('#line-example').chart({ type: 'line', dataset: data, yAxis: { ticks: { number: 10 } } });
};

setData();
