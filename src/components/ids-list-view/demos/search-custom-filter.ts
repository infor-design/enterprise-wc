import eventsJSON from '../../../assets/data/events.json';
import css from '../../../assets/css/ids-list-view/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView: any = document.querySelector('#lv-search-custom');
if (listView) {
  // Set custom search filter to match
  listView.searchFilterCallback = (term: string) => {
    const response = (item: any): boolean => {
      const lcTerm = (term || '').toLowerCase();
      const lcText = (item.comments || '').toLowerCase();

      const match = lcText.indexOf(lcTerm) >= 0;
      return !match;
    };
    return response;
  };

  // Do an ajax request and apply the data to the list
  const url: any = eventsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    listView.data = data;
  };

  await setData();
}
