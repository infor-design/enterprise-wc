import componentsJSON from '../../../assets/data/items-single.json';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: any = document.querySelector('#selectable-example');
  if (chart) {
    // add data to chart
    data[0].data[2].selected = true;
    chart.data = data;

    // listen selected
    chart.addEventListener('selected', (e: any) => {
      console.info('selected', e.detail);
    });

    // listen deselected
    chart.addEventListener('deselected', (e: any) => {
      console.info('deselected', e.detail);
    });
  }
};

await setData();
