// Supporting components
import '../ids-input';
import type IdsInput from '../ids-input';

document.addEventListener('DOMContentLoaded', () => {
  const input12hFormat = document.querySelector('#e2e-input-12h-format');
  const input24hFormat = document.querySelector('#e2e-input-24h-format');

  if (input12hFormat) {
    (input12hFormat as unknown as IdsInput).maskOptions = { format: (input12hFormat as unknown as IdsInput).format };
  }

  if (input24hFormat) {
    (input24hFormat as unknown as IdsInput).maskOptions = { format: (input24hFormat as unknown as IdsInput).format };
  }
});
