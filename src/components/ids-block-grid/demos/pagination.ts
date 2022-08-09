// Example for populating the BlockGrid
import '../ids-block-grid';
import placeHolderImg from '../../../assets/images/placeholder-200x200.png';

const blockGrid: any = document.querySelector('ids-block-grid');

(async function init() {
  // Do an ajax request
  // const url = '/data/products.json';
  // const response = await fetch(url);
  // const data = await response.json();

  const data = [
    {
      id: 1,
      url: placeHolderImg,
      name: 'Sheena Taylor1',
      title: 'Infor, Developer'
    },
    {
      id: 2,
      url: placeHolderImg,
      name: 'Sheena Taylor2',
      title: 'Infor, Developer'
    },
    {
      id: 3,
      url: placeHolderImg,
      name: 'Sheena Taylor3',
      title: 'Infor, Developer'
    },
    {
      id: 4,
      url: placeHolderImg,
      name: 'Sheena Taylor4',
      title: 'Infor, Developer'
    },
    {
      id: 5,
      url: placeHolderImg,
      name: 'Sheena Taylor5',
      title: 'Infor, Developer'
    },
    {
      id: 6,
      url: placeHolderImg,
      name: 'Sheena Taylor6',
      title: 'Infor, Developer'
    },
    {
      id: 7,
      url: placeHolderImg,
      name: 'Sheena Taylor7',
      title: 'Infor, Developer'
    },
    {
      id: 8,
      url: placeHolderImg,
      name: 'Sheena Taylor8',
      title: 'Infor, Developer'
    },
    {
      id: 9,
      url: placeHolderImg,
      name: 'Sheena Taylor9',
      title: 'Infor, Developer'
    },
    {
      id: 10,
      url: placeHolderImg,
      name: 'Sheena Taylor10',
      title: 'Infor, Developer'
    },
    {
      id: 11,
      url: placeHolderImg,
      name: 'Sheena Taylor11',
      title: 'Infor, Developer'
    }
  ];

  blockGrid.data = data;

  blockGrid.pager.addEventListener('pagenumberchange', async (e: { detail: { value: any; }; }) => {
    console.info(`On Page # ${e.detail.value}`);
  });
}());
