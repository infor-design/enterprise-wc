import IdsPopupMenu from '../ids-popup-menu';

// Add Event For Web Component Menu
document.querySelector('ids-popup-menu#popupmenu')!.addEventListener('show', () => {
  console.info('On Show', $('input#input-menu').data('popupmenu'));

  const input = $('input#input-menu');
  if (input.data('popupmenu').isOpen) {
    input.data('popupmenu').close();
  }
});

// Add Event for old component
$('input#input-menu')!.on('beforeopen', () => {
  console.info('On Before Open');
  document.querySelector<IdsPopupMenu>('ids-popup-menu#popupmenu')?.hide();
});
