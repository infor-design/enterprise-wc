// Supporting components

import IdsSwapList from '../ids-swaplist';
import IdsSwappable from '../../ids-swappable/ids-swappable';
import IdsSwappableItem from '../../ids-swappable/ids-swappable-item';
import IdsListView from '../../ids-list-view/ids-list-view';
import IdsText from '../../ids-text/ids-text';
import IdsCard from '../../ids-card/ids-card';

import periodsJSON from '../../../assets/data/periods.json';

// Example for populating the List View
const swaplist = document.querySelector('#swaplist-1');

// Do an ajax request and apply the data to the list
const setData = async () => {
  const res = await fetch(periodsJSON);
  const data = await res.json();
  swaplist.data = data;
};

setData();
