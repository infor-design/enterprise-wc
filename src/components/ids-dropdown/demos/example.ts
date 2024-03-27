import '../ids-dropdown';
import statesJSON from '../../../assets/data/states.json';

const dropdown: any = document.querySelector('#dropdown-1');
dropdown?.addEventListener('change', (e: any) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption.textContent}`);
});

dropdown?.addEventListener('focus', (e: any) => {
  console.info(`Focus Changed to: `, e.target);
});

const dropdownAsync: any = document.querySelector('#dropdown-7');
if (dropdownAsync) {
  let data: any[] = [];
  dropdownAsync.beforeShow = async function beforeShow() {
    if (data.length) return false; // data already set

    const url: any = statesJSON;
    const res = await fetch(url);
    data = await res.json();

    return data;
  };
}
