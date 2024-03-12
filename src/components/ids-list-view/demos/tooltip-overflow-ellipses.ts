import css from '../../../assets/css/ids-list-view/index.css';
import '../../ids-splitter/ids-splitter';
import eventsJSON from '../../../assets/data/events.json';
import type IdsListView from '../ids-list-view';
import type IdsSplitter from '../../ids-splitter/ids-splitter';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView = document.querySelector<IdsListView>('ids-list-view#demo-list-view-searchable');
if (listView) {
  // Do an ajax request and apply the data to the list
  const url: any = eventsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    (listView as any).data = data;
  };

  await setData();

  const splitter: any = document.querySelector<IdsSplitter>('ids-splitter');
  splitter?.addEventListener('sizechanged', (e: CustomEvent) => {
    console.info('sizechanged', e.detail);
    const { splitBar } = e.detail;
    const width = splitBar?.getBoundingClientRect().x;
    if (width) listView.maxWidth = String(width - 100);
  });
}
