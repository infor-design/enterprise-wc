import componentsJSON from '../../../assets/data/components.json';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: any = document.querySelector('#axis-label-example');
  if (chart) {
    chart.data = data;
  }
};

setData();
