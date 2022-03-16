// Supporting components
import IdsDropdown from '../ids-dropdown';
import statesJSON from '../../../assets/data/states.json';

document.querySelector('#dropdown-1')?.addEventListener('change', (e) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption.textContent}`);
});

document.querySelector('#dropdown-1')?.addEventListener('focus', (e) => {
  console.info(`Focus Changed to ${e.target}`);
});

const dropdownAsync = document.querySelector('#dropdown-7');
if (dropdownAsync) {
  dropdownAsync.beforeShow = async function beforeShow() {
    const res = await fetch(statesJSON);
    const data = await res.json();
    return data;
  };
}
