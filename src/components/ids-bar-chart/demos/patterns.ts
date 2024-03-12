import componentsColorsJSON from '../../../assets/data/components-patterns.json';
import '../ids-bar-chart';

const setData = async () => {
  const res = await fetch(componentsColorsJSON as any);
  const data = await res.json();
  const chart: any = document.querySelector('#patterns-example');
  if (chart) {
    chart.data = data;
  }
};
await setData();
