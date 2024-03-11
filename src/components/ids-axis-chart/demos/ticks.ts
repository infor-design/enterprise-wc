import componentsJSON from '../../../assets/data/components.json';
import type IdsAxisChart from '../ids-axis-chart';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart = document.querySelector<IdsAxisChart>('#index-example');
  if (chart) {
    chart.data = data;
  }
};

await setData();
