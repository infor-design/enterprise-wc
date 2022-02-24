document.addEventListener('DOMContentLoaded', async () => {
  /**
   * MODAL ELEMENTS DEFAULT VALUE
   */
  const editorModalElementsValueEl = document.querySelector('#editor-modal-elements-value');
  if (editorModalElementsValueEl) {
    const modals = {
      hyperlink: {
        url: 'https://',
        classes: '',
        targets: [{ text: 'New Window', value: '_blank', selected: true }],
        showIsClickable: false
      },
      insertimage: { url: '../assets/images/placeholder-200x200.png' }
    };
    editorModalElementsValueEl.modalElementsValue(modals);
  }

  /**
   * EDITOR EVENTS
   */
  const editorEventsEl = document.querySelector('#editor-events');
  const radioBeforeEditor = document.querySelector('#radio-editor-evt-beforeeditormode');
  const radioBeforeSource = document.querySelector('#radio-editor-evt-beforesourcemode');
  const radioBeforePaste = document.querySelector('#radio-editor-evt-beforepaste');
  const cbPasteAsPlainText = document.querySelector('#cb-paste-as-plain-text');
  if (editorEventsEl) {
    // display colcole logs
    const show = (type, detail, veto) => {
      const showVeto = typeof veto !== 'undefined' ? `veto: ${veto}` : '';
      console.info(type, (detail ?? ''), showVeto);
    };

    // before editor mode
    editorEventsEl.addEventListener('beforeeditormode', (e) => {
      const veto = radioBeforeEditor.value;
      show('beforeeditormode', e.detail, veto);
      e.detail.response(veto);
    });
    // after editor mode
    editorEventsEl.addEventListener('aftereditormode', (e) => {
      show('aftereditormode', e.detail);
    });
    // before source mode
    editorEventsEl.addEventListener('beforesourcemode', (e) => {
      const veto = radioBeforeSource.value;
      show('beforesourcemode', e.detail, veto);
      e.detail.response(veto);
    });
    // after source mode
    editorEventsEl.addEventListener('aftersourcemode', (e) => {
      show('aftersourcemode', e.detail);
    });
    // if requested view mode reject
    editorEventsEl.addEventListener('rejectviewchange', (e) => {
      show('rejectviewchange', e.detail);
    });
    // after requested view mode change
    editorEventsEl.addEventListener('viewchange', (e) => {
      show('viewchange', e.detail);
    });
    // before paste
    editorEventsEl.addEventListener('beforepaste', (e) => {
      // Set paste as plain text setting
      editorEventsEl.pasteAsPlainText = cbPasteAsPlainText.checked;
      const veto = radioBeforePaste.value;
      show('beforepaste', e.detail, veto);
      e.detail.response(veto);
    });
    // after paste
    editorEventsEl.addEventListener('afterpaste', (e) => {
      show('afterpaste', e.detail);
    });
    // if reject paste content
    editorEventsEl.addEventListener('rejectpaste', (e) => {
      show('rejectpaste', e.detail);
    });
    // // change event
    // editorEventsEl.addEventListener('change', () => {
    //   show('change');
    // });
    // // initialize event
    // editorEventsEl.addEventListener('initialize', () => {
    //   show('initialize');
    // });
  }
});
