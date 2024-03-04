import json from '../../../assets/data/menu-array-lazy.json';
import submenuJson from '../../../assets/data/menu-array-submenu.json';
import IdsPopupMenu from '../ids-popup-menu';

document.addEventListener('DOMContentLoaded', () => {
  const popupmenuEl: IdsPopupMenu = document.querySelector('#popupmenu')!;
  let submenuCount = 1;
  // Load/set data on ajax request this fires for submenus
  popupmenuEl.beforeShow = async (opts: any) => {
    if (opts.isSubmenu) {
      // Ajax Call for submenu data
      const res = await fetch(submenuJson as any);
      const submenuData = await res.json();

      // Make the data ids and text count up
      submenuCount++;
      const numName = '0One0Two0Three0Four0Five0Six0Seven0Eight0Nine'.split('0')[submenuCount];
      submenuData.id = submenuData.id.replace('{0}', submenuCount);
      submenuData.items[0].id = submenuData.items[0].id.replace('{0}', submenuCount);
      submenuData.items[1].id = submenuData.items[1].id.replace('{0}', submenuCount);
      submenuData.items[2].id = submenuData.items[2].id.replace('{0}', submenuCount);
      submenuData.items[2].text = submenuData.items[2].text.replace('{0}', numName);
      submenuData.items[2].submenu.id = submenuData.items[2].submenu.id.replace('{0}', submenuCount);

      return submenuData;
    }
    const res = await fetch(json as any);
    const data = await res.json();
    return data;
  };

  // Load/set data on ajax request this fires for submenus
  popupmenuEl.addEventListener('hide', () => {
    submenuCount = 1;
  });
  popupmenuEl.addEventListener('show', () => {
    submenuCount = 1;
  });
});
