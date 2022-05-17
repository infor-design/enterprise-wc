import '../ids-slider';
import '../../ids-input/ids-input';
import '../../ids-draggable/ids-draggable';

document.addEventListener('DOMContentLoaded', () => {
  const slider: any = document.querySelector('#slider-bound');
  const input: any = document.querySelector('#slider-value');

  const formatValue = (val: number) => `${val.toFixed(3)}`;

  input.onEvent('change', input, (e: any) => {
    slider.value = e.target.value;
  });

  const changeInputOnSliderChange = (e: any) => {
    input.value = formatValue(e.detail.value);
  };
  slider.onEvent('ids-slider-drag', slider, changeInputOnSliderChange);
  slider.onEvent('change', slider, changeInputOnSliderChange);
});
