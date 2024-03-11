import componentsJSON from '../../../assets/data/components.json';

const url = componentsJSON;
const setData = async () => {
  const res = await fetch(url as any);
  const data = await res.json();

  const chart = document.querySelector('#selectable-example');
  if (chart) {
    (chart as any).data = data;

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
