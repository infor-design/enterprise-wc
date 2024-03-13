import componentsJSON from '../../../assets/data/components-no-name.json';
import IdsAxisChart from '../ids-axis-chart';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: IdsAxisChart | null = document.querySelector('#index-example');
  if (chart) {
    chart.data = data;
  }
};

await setData();
