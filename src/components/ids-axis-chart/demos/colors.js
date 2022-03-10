import IdsAxisChart from '../ids-axis-chart';
import componentsColorsJSON from '../../../assets/data/components-colors.json';

const setData = async () => {
  const res = await fetch(componentsColorsJSON);
  const data = await res.json();
  document.querySelector('ids-axis-chart').data = data;
};

setData();
