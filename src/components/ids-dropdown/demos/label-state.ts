import '../ids-dropdown';
import statesJSON from '../../../assets/data/states.json';

const populate = async () => {
  const url: any = statesJSON;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const dropdowns: Array<any> = [...document.querySelectorAll('ids-dropdown')];
dropdowns.forEach((dropdown: any) => {
  dropdown.beforeShow = populate;
});
