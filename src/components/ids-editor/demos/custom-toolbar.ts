import '../../ids-loading-indicator/ids-loading-indicator';
import type IdsButton from '../../ids-button/ids-button';
import type IdsLoadingIndicator from '../../ids-loading-indicator/ids-loading-indicator';

document.addEventListener('DOMContentLoaded', async () => {
  const editor = document.querySelector('ids-editor');
  const genAIBtn = editor?.querySelector<IdsButton>('ids-button[editor-action="generativeai"]');
  const genAIBusyIndicator = document.createElement('ids-loading-indicator') as IdsLoadingIndicator;
  genAIBusyIndicator.setAttribute('generative-ai', '');
  let isAIBusy = false;

  genAIBtn?.addEventListener('click', () => {
    if (isAIBusy) {
      genAIBusyIndicator?.remove();
    } else {
      editor?.append(genAIBusyIndicator);
    }

    genAIBtn.toggleGenAIActiveState(!isAIBusy);
    isAIBusy = !isAIBusy;
  });
});
