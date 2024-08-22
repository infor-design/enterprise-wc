import '../ids-dropdown';

const carOptions = [
  { name: 'volvo', id: 1, idx: '1718693262079751588' },
  { name: 'saab', id: 2, idx: '1718693262733452505' },
  { name: 'opel', id: 3, idx: '1718693263497253422' },
  { name: 'audi', id: 4, idx: '1718693264241054349' },
];

const dropdown = document.querySelector('#dropdown-car')!;
const sourceNameButton = document.querySelector('#source-name-button')!;
const sourceIdxButton = document.querySelector('#source-idx-button')!;

sourceIdxButton?.addEventListener('click', () => {
  carOptions.forEach((car) => {
    dropdown.querySelector(`ids-list-box-option[value="${car.idx}"]`)!.textContent = car.idx;
  });
});

sourceNameButton?.addEventListener('click', () => {
  carOptions.forEach((car) => {
    dropdown.querySelector(`ids-list-box-option[value="${car.idx}"]`)!.textContent = car.name;
  });
});
