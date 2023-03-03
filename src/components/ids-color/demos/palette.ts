// Supporting components
import '../ids-color';

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    // Set Label Text
    document.querySelectorAll('ids-color').forEach((color: any) => {
      if (color.label) {
        color.label = getComputedStyle(document.body).getPropertyValue(color.label.trim()).trim();
      }
    });
  });
});
