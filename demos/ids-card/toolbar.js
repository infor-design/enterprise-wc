import IdsCard from '../../src/components/ids-card/ids-card';
import IdsListView from '../../src/components/ids-list-view/ids-list-view';
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';
import IdsPopupMenu, {
  IdsMenuGroup,
  IdsMenuItem,
  IdsMenuHeader,
  IdsSeparator
} from '../../src/components/ids-popup-menu/ids-popup-menu';
import IdsText from '../../src/components/ids-text/ids-text';
import './toolbar.scss';

// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url = '/data/events.json';

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  listView.forEach((l) => {
    l.data = data;
  });
};

setData();
