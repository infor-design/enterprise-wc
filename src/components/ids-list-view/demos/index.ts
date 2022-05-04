// Supporting components
import '../ids-list-view';
import '../../ids-card/ids-card';
import '../../ids-draggable/ids-draggable';
import eventsJSON from '../../../assets/data/events.json';
import css from '../../../assets/css/ids-list-view/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView = document.querySelector('ids-list-view:not([id])');
if (listView) {
  // Do an ajax request and apply the data to the list
  const url: any = eventsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    (listView as any).data = data;
  };

  setData();
}
