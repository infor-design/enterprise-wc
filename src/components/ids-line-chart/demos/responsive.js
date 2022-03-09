import IdsLineChart from '../ids-line-chart';
import componentsJSON from '../../../assets/data/components.json';

const setData = async () => {
  const res = await fetch(componentsJSON);
  const data = await res.json();
  document.querySelector('ids-line-chart').data = data;
};

setData();
