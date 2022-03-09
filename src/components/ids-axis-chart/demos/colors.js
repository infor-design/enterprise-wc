import IdsAxisChart from '../ids-axis-chart';
import componentsJSON from '../../../assets/data/components.json';

const url = componentsJSON;
const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  document.querySelector('ids-axis-chart').data = data;
};

setData();
