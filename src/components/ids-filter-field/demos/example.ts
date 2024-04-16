import IdsFilterField from '../ids-filter-field';

const fieldfilterData = [
  { value: 'equals', text: 'Equals', icon: 'filter-equals' },
  { value: 'in-range', text: 'In Range', icon: 'filter-in-range' },
  { value: 'does-not-equal', text: 'Does Not Equal', icon: 'filter-does-not-equal' },
];

document.addEventListener('DOMContentLoaded', () => {
  const filterField = document.querySelector<IdsFilterField>('ids-filter-field');
  filterField!.operators = fieldfilterData;

  filterField?.addEventListener('change', console.log);
});
