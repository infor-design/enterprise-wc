import IdsSearchField from '../ids-search-field';
import IdsHeader from '../../ids-header/ids-header';
import IdsToolbar from '../../ids-toolbar/ids-toolbar';

import statesJSON from '../../../assets/data/states.json';

const input = document.querySelector('#searchfield-autocomplete');

const setData = async () => {
  const res = await fetch(statesJSON);
  const data = await res.json();
  input.data = data;
};

setData();
