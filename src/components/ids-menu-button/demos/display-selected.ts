document.addEventListener('DOMContentLoaded', () => {
  const btnEl: any = document.querySelector('#menu-button');
  const btnSpanEl: any = btnEl.querySelector('[slot="text"]');
  const menuEl: any = document.querySelector('#my-menu');
  menuEl.addEventListener('selected', (e: any) => {
    const target = e.detail.elem;
    if (target !== null) {
      const text = target.textContent.trim();
      btnSpanEl.innerHTML = text;
      console.info('Menu Item Selected', e.detail.elem);
    }
  });
});
