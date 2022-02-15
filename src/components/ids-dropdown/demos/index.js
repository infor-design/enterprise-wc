// Supporting components
import IdsDropdown from '../ids-dropdown';

document.querySelector('#dropdown-1')?.addEventListener('change', (e) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption.textContent}`);
});

document.querySelector('#dropdown-1')?.addEventListener('focus', (e) => {
  console.info(`Focus Changed to ${e.target}`);
});

const dropdownAsync = document.querySelector('#dropdown-7');
dropdownAsync.beforeShow = async function beforeShow() {
  const url = '/data/states.json';

  const res = await fetch(url);
  const data = await res.json();
  return data;
};
