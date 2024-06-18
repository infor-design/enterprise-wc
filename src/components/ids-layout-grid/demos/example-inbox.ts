// Supporting components
import '../../ids-list-view/ids-list-view';
import '../../ids-button/ids-button';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-textarea/ids-textarea';
import '../../ids-color-picker/ids-color-picker';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-lookup/ids-lookup';
import '../../ids-radio/ids-radio';
import '../../ids-search-field/ids-search-field';
import '../../ids-spinbox/ids-spinbox';
import '../../ids-switch/ids-switch';
import '../../ids-time-picker/ids-time-picker';
import '../../ids-upload/ids-upload';
import '../../ids-multiselect/ids-multiselect';
import '../../ids-hidden/ids-hidden';
import '../../ids-splitter/ids-splitter';
import productsJSON from '../../../assets/data/products-100.json';

// Example for populating the List View
const listView: any = document.querySelector('#demo-lv-selectable-single');

if (listView) {
  // Do an ajax request and apply the data to the list
  const url: any = productsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    listView.data = data;
  };

  listView.addEventListener('selected', (e: any) => {
    console.info('selected event called', e.detail);
  });
  listView.addEventListener('deselected', (e: any) => {
    console.info('deselected event called', e.detail);
  });
  listView.addEventListener('click', (e: any) => {
    console.info('clicked event called', e.detail);
  });
  listView.addEventListener('activated', (e: any) => {
    console.info('activated event called', e.detail);
  });

  await setData();
}
