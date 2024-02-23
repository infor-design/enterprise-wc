import json from '../../../assets/data/menu-array-lazy.json';
import submenuJson from '../../../assets/data/menu-array-submenu.json';
import IdsPopupMenu from '../ids-popup-menu';

document.addEventListener('DOMContentLoaded', () => {
  const popupmenuEl: IdsPopupMenu = document.querySelector('#popupmenu')!;

  // Load/set data on ajax request
  popupmenuEl.beforeShow = async (opts: any) => {
    if (opts.isSubmenu) {
      console.info('submenu', opts.contextElement);
      const res = await fetch(submenuJson as any);
      const submenuData = await res.json();
      return submenuData;
    }
    const res = await fetch(json as any);
    const data = await res.json();
    return data;
  };
});
