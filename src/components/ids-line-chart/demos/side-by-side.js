// Init Web Components
import componentsJSON from '../../../assets/data/components.json';

const setData = async () => {
  const res = await fetch(componentsJSON);
  const data = await res.json();

  document.querySelector('ids-line-chart').data = data;
  $('#line-example').chart({type: 'line', dataset: data, yAxis: {ticks: {number: 10} } });
};

setData();

// Init 4.x
$('body').initialize();
