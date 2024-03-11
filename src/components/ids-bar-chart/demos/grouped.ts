import '../ids-bar-chart';
import componentsJSON from '../../../assets/data/components.json';

const url = componentsJSON;
const setData = async () => {
  const res = await fetch(url as any);
  const data = await res.json();

  const chart: any = document.querySelector('#grouped-example');
  if (chart) {
    chart.data = data;

    // selected
    chart.addEventListener('selected', (e: any) => {
      console.info('selected', e.detail);
    });

    // deselected
    chart.addEventListener('deselected', (e: any) => {
      console.info('deselected', e.detail);
    });
  }
};

await setData();
