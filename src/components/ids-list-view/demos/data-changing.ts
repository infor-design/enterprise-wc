import '../ids-list-view';
import type IdsListView from '../ids-list-view';
import productsJSON from '../../../assets/data/products-100.json';

const listView = document.querySelector<IdsListView>('ids-list-view');

if (listView) {
  const url: any = productsJSON;

  const setInitialData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    listView.data = data.slice(0, 10);
  };
  setInitialData();

  // Changes data when an item is activated
  const setNewData = async (e: any) => {
    console.info(e.detail.index);

    const res = await fetch(url);
    const data = await res.json();
    listView.data = data.slice(11, 16);
  };

  listView.addEventListener('itemactivated', setNewData);
}
