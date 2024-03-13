import IdsLineChart from '../ids-line-chart';
import componentsJSON from '../../../assets/data/components.json';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: IdsLineChart | any = document.querySelector('#selectable-example');
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
