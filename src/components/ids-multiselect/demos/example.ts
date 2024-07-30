import '../ids-multiselect';
import statesJSON from '../../../assets/data/states.json';

const multiselect: any = document.querySelector('#multiselect-1');
multiselect?.addEventListener('change', (e: any) => {
  console.info(`e.target.selectedOption`, e.target?.selectedOption);
  console.info(`e.target.selectedOptions`, e.target?.selectedOptions);
  console.info(`Value Changed to :`, e.target.value, e.detail.value);
});

multiselect?.addEventListener('focus', (e: any) => {
  console.info(`Focus Changed to `, e.target);
});

const multiselectAsync: any = document.querySelector('#multiselect-ajax');
if (multiselectAsync) {
  let data: any[] = [];

  multiselectAsync.beforeShow = async function beforeShow() {
    if (data.length) return false; // data already set

    const url: any = statesJSON;
    const res = await fetch(url);
    data = await res.json();

    return data.map((item) => ({
      ...item,
      isCheckbox: true,
    }));
  };
}
