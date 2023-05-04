// Supporting components
import '../ids-color';

window.onload = () => {
  // Set Label Text
  document.querySelectorAll('ids-color').forEach((color: any) => {
    if (color.label) {
      color.label = getComputedStyle(document.body).getPropertyValue(color.label.trim()).trim();
    }
  });
};
