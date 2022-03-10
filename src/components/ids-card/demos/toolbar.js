import IdsCard from '../ids-card';
import IdsListView from '../../ids-list-view/ids-list-view';
import IdsButton from '../../ids-button/ids-button';
import IdsInput from '../../ids-input/ids-input';
import IdsToolbar from '../../ids-toolbar/ids-toolbar';
import IdsMenuButton from '../../ids-menu-button/ids-menu-button';
import IdsPopupMenu, {
  IdsMenuGroup,
  IdsMenuItem,
  IdsMenuHeader,
  IdsSeparator
} from '../../ids-popup-menu/ids-popup-menu';
import eventsJSON from '../../../assets/data/events.json';
import IdsText from '../../ids-text/ids-text';

// Import Css
import css from '../../../assets/css/ids-card/toolbar.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url = eventsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.forEach((l) => {
    l.data = data;
  });
};

setData();
