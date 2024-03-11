import componentsJSON from '../../../assets/data/components.json';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: any = document.querySelector('#horizontal-example');
  if (chart) {
    chart.data = data;
  }
};

await setData();
