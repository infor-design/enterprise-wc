import '../ids-dropdown';
import statesJSON from '../../../assets/data/states.json';
import type IdsDropdown from '../ids-dropdown';

const dropdown: any = document.querySelector<IdsDropdown>('ids-dropdown');

dropdown?.addEventListener('change', (e: any) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption?.textContent || ''}`);
});

dropdown?.addEventListener('focus', (e: any) => {
  console.info(`Focus Changed to: `, e.target);
});

if (dropdown) {
  const url: any = statesJSON;
  const res = await fetch(url);
  dropdown.data = await res.json();
  dropdown.value = 'CA';
}
