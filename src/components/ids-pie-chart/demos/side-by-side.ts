import json from '../../../assets/data/items-single.json';

// Init Web Components
let data = [];

const setData = async () => {
  const res = await fetch(json as any);
  data = await res.json();

  // Init Web Components
  (document as any).querySelector('#web-comp-example').data = data;

  // Init 4.x
  (document as any).querySelector('ids-container').removeAttribute('hidden');
  $('#4x-example').chart({ type: 'pie', dataset: data });
};

await setData();
