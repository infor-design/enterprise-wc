import '../ids-search-field';
import '../../ids-header/ids-header';
import '../../ids-toolbar/ids-toolbar';

import statesJSON from '../../../assets/data/states.json';

const url: any = statesJSON;

const autocomplete: Element | any = document.querySelector('#search-field-autocomplete');

if (autocomplete) {
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    autocomplete.data = data;
  };

  setData();
}
