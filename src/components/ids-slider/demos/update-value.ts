import '../ids-slider';
import '../../ids-input/ids-input';
import '../../ids-draggable/ids-draggable';

document.addEventListener('DOMContentLoaded', () => {
  const slider: any = document.querySelector('#slider-bound');
  const input: any = document.querySelector('#slider-value');

  input.onEvent('change', input, (e: any) => {
    slider.value = e.target.value;
  });

  slider.onEvent('change', slider, (e: any) => {
    input.value = `${e.detail.value}`;
  });
});
