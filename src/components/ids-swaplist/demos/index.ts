// Supporting components

import '../ids-swaplist';
import '../../ids-swappable/ids-swappable';
import '../../ids-swappable/ids-swappable-item';
import '../../ids-list-view/ids-list-view';
import '../../ids-text/ids-text';
import '../../ids-card/ids-card';

import periodsJSON from '../../../assets/data/periods.json';

// Example for populating the List View
const swaplist: any = document.querySelector('#swaplist-1');
const url: any = periodsJSON;

// Do an ajax request and apply the data to the list
const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  swaplist.data = data;
};

setData();
