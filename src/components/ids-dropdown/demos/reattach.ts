import IdsDropdown from '../ids-dropdown';

document.querySelector('#reattach')?.addEventListener('click', () => {
  const dropdown = document.querySelector<IdsDropdown>('ids-dropdown') as any;
  const dropdownParent = dropdown?.parentNode;
  dropdownParent?.removeChild(dropdown);
  dropdownParent.appendChild(dropdown);
});
