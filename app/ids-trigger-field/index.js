import IdsTriggerField from '../../src/ids-trigger-field/ids-trigger-field';

document.addEventListener('DOMContentLoaded', () => {
  const triggerFields = document.querySelectorAll('ids-trigger-field');
  triggerFields.forEach((trigger) => trigger.addEventListener('triggerfield', (e) => console.log(e)));
});
