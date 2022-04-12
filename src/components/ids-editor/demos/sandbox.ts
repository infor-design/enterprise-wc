document.addEventListener('DOMContentLoaded', async () => {
  /**
   * MODAL ELEMENTS DEFAULT VALUE
   */
  const editorModalElementsValueEl: any = document.querySelector('#editor-modal-elements-value');
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
  const editorEventsEl: any = document.querySelector('#editor-events');
  const radioBeforeEditor: any = document.querySelector('#radio-editor-evt-beforeeditormode');
  const radioBeforeSource: any = document.querySelector('#radio-editor-evt-beforesourcemode');
  const radioBeforePaste: any = document.querySelector('#radio-editor-evt-beforepaste');
  const cbPasteAsPlainText: any = document.querySelector('#cb-paste-as-plain-text');
  if (editorEventsEl) {
    // display console logs
    const show = (type: string, detail: string, veto?: boolean) => {
      const showVeto = typeof veto !== 'undefined' ? `veto: ${veto}` : '';
      console.info(type, (detail ?? ''), showVeto);
    };

    // before editor mode
    editorEventsEl.addEventListener('beforeeditormode', (e: any) => {
      const veto: boolean = radioBeforeEditor.value;
      show('beforeeditormode', e.detail, veto);
      e.detail.response(veto);
    });
    // after editor mode
    editorEventsEl.addEventListener('aftereditormode', (e: any) => {
      show('aftereditormode', e.detail);
    });
    // before source mode
    editorEventsEl.addEventListener('beforesourcemode', (e: any) => {
      const veto = radioBeforeSource.value;
      show('beforesourcemode', e.detail, veto);
      e.detail.response(veto);
    });
    // after source mode
    editorEventsEl.addEventListener('aftersourcemode', (e: any) => {
      show('aftersourcemode', e.detail);
    });
    // if requested view mode reject
    editorEventsEl.addEventListener('rejectviewchange', (e: any) => {
      show('rejectviewchange', e.detail);
    });
    // after requested view mode change
    editorEventsEl.addEventListener('viewchange', (e: any) => {
      show('viewchange', e.detail);
    });
    // before paste
    editorEventsEl.addEventListener('beforepaste', (e: any) => {
      // Set paste as plain text setting
      editorEventsEl.pasteAsPlainText = cbPasteAsPlainText.checked;
      const veto = radioBeforePaste.value;
      show('beforepaste', e.detail, veto);
      e.detail.response(veto);
    });
    // after paste
    editorEventsEl.addEventListener('afterpaste', (e: any) => {
      show('afterpaste', e.detail);
    });
    // if reject paste content
    editorEventsEl.addEventListener('rejectpaste', (e: any) => {
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
