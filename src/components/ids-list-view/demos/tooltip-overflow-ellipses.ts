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
const listView1 = document.querySelector<IdsListView>('ids-list-view#demo-list-view-tooltip-html');
const listView2 = document.querySelector<IdsListView>('ids-list-view#demo-list-view-tooltip-plain-text');

const url: any = eventsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  (listView1 as any).data = data;
  (listView2 as any).data = data;
};

const splitter: any = document.querySelector<IdsSplitter>('ids-splitter');
const splitterPaneRight = document.querySelector<IdsListView>('ids-splitter-pane#p2');
splitterPaneRight?.style.setProperty('padding-left', '50px');

splitter?.addEventListener('sizechanged', (e: CustomEvent) => {
  console.info('sizechanged', e.detail);
  const { splitBar } = e.detail;
  const width = splitBar?.getBoundingClientRect().x;
  if (width) {
    if (listView1) listView1.maxWidth = `${width - 100}px`;
    if (listView2) listView2.maxWidth = `${window.innerWidth - (width + 200)}px`;
  }
});

await setData();
