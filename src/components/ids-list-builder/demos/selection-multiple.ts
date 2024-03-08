import bikesJSON from '../../../assets/data/bikes.json';

// Example for populating the List Builder with Ajax
const listBuilder2: any = document.querySelector('#list-builder-2');

const addEventListeners = (element: any) => {
  const eventList = [
    'itemClick', 'itemSelect',
    'itemAdd', 'itemDelete',
    'itemMoveUp', 'itemMoveDown',
    'listDataChange', 'itemChange',
  ];

  eventList.forEach((eventName: string) => {
    element.addEventListener(eventName, (e: CustomEvent) => {
      if ('detail' in e) {
        console.info(eventName, e.detail);
      }
    });
  });
};

// Do an ajax request and apply the data to the list
const setData = async () => {
  const res = await fetch((bikesJSON as any));
  const data = await res.json();

  listBuilder2.data = data;
  addEventListeners(listBuilder2);
};

await setData();
