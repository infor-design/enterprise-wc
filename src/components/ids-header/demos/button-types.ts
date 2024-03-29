document.addEventListener('DOMContentLoaded', () => {
  const primaryBtn = document.querySelector('#button-1');
  const secondaryBtn = document.querySelector('#button-2');
  const tertiaryBtn = document.querySelector('#button-3');
  const disabledBox: any = document.querySelector('#controls-disabled');

  // Enable/Disable the three buttons when checking/unchecking the control box
  disabledBox.addEventListener('change', () => {
    [primaryBtn, secondaryBtn, tertiaryBtn].forEach((btn: any) => {
      btn.disabled = disabledBox.checked;
    });
  });
});
