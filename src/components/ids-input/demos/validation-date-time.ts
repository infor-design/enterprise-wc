// Supporting components
import '../ids-input';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.input-mask')
    .forEach((item: any) => {
      item.maskOptions = { format: item.format };
    });
});
