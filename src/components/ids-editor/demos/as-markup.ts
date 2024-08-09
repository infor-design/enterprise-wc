import placeHolderUrl from '../../../assets/images/placeholder-154x120.png';
import IdsEditor from '../ids-editor';

const editorEl = document.querySelector<IdsEditor>('#editor-demo')!;
document.addEventListener('DOMContentLoaded', async () => {
  const modals = {
    insertimage: {
      url: placeHolderUrl,
    }
  };
  editorEl.modalElementsValue(modals);
});
