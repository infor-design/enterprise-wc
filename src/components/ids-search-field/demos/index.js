import IdsSearchField from '../ids-search-field';
import IdsHeader from '../../ids-header/ids-header';
import IdsToolbar from '../../ids-toolbar/ids-toolbar';

import statesJSON from '../../../assets/data/states.json';

const autocomplete = document.querySelector('#search-field-autocomplete');

const setData = async () => {
  const res = await fetch(statesJSON);
  const data = await res.json();
  autocomplete.data = data;
};

setData();
