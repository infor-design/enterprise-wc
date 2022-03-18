// Supporting components
import '../ids-list-view';
import '../../ids-card/ids-card';
import '../../ids-draggable/ids-draggable';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import eventsJSON from '../../../assets/data/events.json';
import css from '../../../assets/css/ids-list-view/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url: any = eventsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.forEach((l: any) => {
    l.data = data;
  });
};

setData();
