// Supporting components
import IdsDropdown from '../ids-dropdown';
import statesJSON from '../../../assets/data/states.json';

const dropdown: IdsDropdown | null = (document.querySelector('#dropdown-1') as unknown as IdsDropdown);
dropdown?.addEventListener('change', (e: any) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption.textContent}`);
});

dropdown?.addEventListener('focus', (e: any) => {
  console.info(`Focus Changed to ${e.target}`);
});

const dropdownAsync: IdsDropdown | null = (document.querySelector('#dropdown-7') as unknown as IdsDropdown);
if (dropdownAsync) {
  dropdownAsync.beforeShow = async function beforeShow() {
    const url: any = statesJSON;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  };
}
