import componentsColorsJSON from '../../../assets/data/components-colors.json';

const setData = async () => {
  const res = await fetch(componentsColorsJSON as any);
  const data = await res.json();
  (document.querySelector('ids-area-chart') as any).data = data;
};
setData();
