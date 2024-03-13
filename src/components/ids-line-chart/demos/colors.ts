import componentsColorsJSON from '../../../assets/data/components-colors.json';

const setData = async () => {
  const res = await fetch(componentsColorsJSON as any);
  const data = await res.json();
  (document as any).querySelector('ids-line-chart').data = data;
};

await setData();
