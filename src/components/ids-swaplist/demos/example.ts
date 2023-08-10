import swaplistData from '../../../assets/data/swaplist-data.json';

// Example for populating the List View
const swaplist: any = document.querySelector('#swaplist-1');
const url: any = swaplistData;

// Listen for swaplist updates
swaplist?.addEventListener('updated', (e: any) => {
  console.info('Swaplist Updated', e.detail.data);
});

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  swaplist.data = data;
};

setData();
