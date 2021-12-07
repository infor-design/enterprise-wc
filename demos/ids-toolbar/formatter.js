document.addEventListener('DOMContentLoaded', () => {
  const btnFontpicker = document.querySelector('#btn-fontpicker');
  btnFontpicker?.menuEl.popup.addEventListener('selected', (e) => {
    btnFontpicker.text = e.detail.elem.text;
  });
});
