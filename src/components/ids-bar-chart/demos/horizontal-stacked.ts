import '../ids-bar-chart';
import componentsJSON from '../../../assets/data/components.json';

const url = componentsJSON;
const setData = async () => {
  const res = await fetch(url as any);
  const data = await res.json();

  const chart: any = document.querySelector('#horizontal-stacked-example');
  if (chart) {
    chart.data = data;
  }
};

await setData();
