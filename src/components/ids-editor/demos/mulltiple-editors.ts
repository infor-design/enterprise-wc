import placeHolderUrl from '../../../assets/images/placeholder-154x120.png';
import IdsEditor from '../ids-editor';

const editorEl = document.querySelector<IdsEditor>('#editor-demo-one')!;
document.addEventListener('DOMContentLoaded', async () => {
  const modals = {
    insertimage: {
      url: placeHolderUrl,
    }
  };
  editorEl.modalElementsValue(modals);
});

const editorEl2 = document.querySelector<IdsEditor>('#editor-demo-two')!;
document.addEventListener('DOMContentLoaded', async () => {
  const modals = {
    insertimage: {
      url: placeHolderUrl,
    }
  };
  editorEl2.modalElementsValue(modals);
});
