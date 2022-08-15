// IdsSplitter Sandbox
import '../../ids-radio/ids-radio';

import css from '../../../assets/css/ids-splitter/sandbox.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);

document.addEventListener('DOMContentLoaded', async () => {
  // Disable / Enable
  const splitterDe: any = document.querySelector('#splitter-disable-enable');
  const btnDisableEnable: any = document.querySelector('#btn-splitter-disable-enable');
  let isDisabled = false;
  const toggleDisableEnable = () => {
    isDisabled = !isDisabled;
    splitterDe.disabled = isDisabled;
    btnDisableEnable.text = `${isDisabled ? 'Enable' : 'Disable'} Splitter`;
  };
  toggleDisableEnable();
  btnDisableEnable?.addEventListener('click', () => {
    toggleDisableEnable();
  });

  // Events
  const btnCollapseExpand: any = document.querySelector('#btn-splitter-collapse-expand');
  const splitterEvt: any = document.querySelector('#splitter-events');
  const radioBeforeCollapsed: any = document.querySelector('#radio-splitter-evt-beforecollapsed');
  const radioBeforeExpanded: any = document.querySelector('#radio-splitter-evt-beforeexpanded');
  const radioBeforeSizeChanged: any = document.querySelector('#radio-splitter-evt-beforesizechanged');

  if (splitterEvt && btnCollapseExpand) {
    const show = (type: string, detail: string, veto?: boolean) => {
      const showVeto = typeof veto !== 'undefined' ? `veto: ${veto}` : '';
      console.info(type, detail, showVeto);
    };

    // event: before collapsed
    splitterEvt.addEventListener('beforecollapsed', (e: CustomEvent) => {
      const veto = radioBeforeCollapsed.value;
      show('beforecollapsed', e.detail, veto);
      e.detail.response(veto);
    });

    // event: collapsed
    splitterEvt.addEventListener('collapsed', (e: CustomEvent) => {
      show('collapsed', e.detail);
    });

    // event: before expanded
    splitterEvt.addEventListener('beforeexpanded', (e: CustomEvent) => {
      const veto = radioBeforeExpanded.value;
      show('beforeexpanded', e.detail, veto);
      e.detail.response(veto);
    });

    // event: expanded
    splitterEvt.addEventListener('expanded', (e: CustomEvent) => {
      show('expanded', e.detail);
    });

    // event: before size changed
    splitterEvt.addEventListener('beforesizechanged', (e: CustomEvent) => {
      const veto = radioBeforeSizeChanged.value;
      show('beforesizechanged', e.detail, veto);
      e.detail.response(veto);
    });

    // event: size changed
    splitterEvt.addEventListener('sizechanged', (e: CustomEvent) => {
      show('sizechanged', e.detail);
    });

    // Toggle collapse expand
    let isCollapsed = false;
    const toggleCollapseExpand = () => {
      const veto: any = {
        collapsed: radioBeforeCollapsed.value,
        expanded: radioBeforeExpanded.value,
        sizeChanged: radioBeforeSizeChanged.value,
        toggled: false
      };
      const options = { startPane: '.splitter-evt-p1', endPane: '.splitter-evt-p2' };
      if (isCollapsed) {
        splitterEvt.expand(options);
        veto.toggled = veto.expanded;
      } else {
        splitterEvt.collapse(options);
        veto.toggled = veto.collapsed;
      }

      if (veto.toggled === 'true' && veto.sizeChanged === 'true') {
        isCollapsed = !isCollapsed;
      }
      btnCollapseExpand.text = `${isCollapsed ? 'Expand' : 'Collapse'}`;
    };
    btnCollapseExpand.addEventListener('click', () => {
      toggleCollapseExpand();
    });
  }

  /*
   * Save position
   * apply only when `save-position` set to true
   *
   * uniqueId: Use to clear the saved position from storage
   * if not will use internal auto generated id
   */
  const uniqueId1 = 'some-uniqueid-1';
  const uniqueId2 = 'some-uniqueid-2';

  const splitterSave1: any = document.querySelector('#splitter-save1');
  const splitterSave2: any = document.querySelector('#splitter-save2');
  const btnSaveClear: any = document.querySelector('#btn-splitter-save-clear');
  btnSaveClear.menuEl.addEventListener('selected', (e: any) => {
    const sel = e.detail.value;

    // Clear position for saved Splitter(1)
    if (sel === 'clear-saved-splitter-1') {
      splitterSave1.clearPosition(uniqueId1);
    }

    // Clear position for saved Splitter(2)
    if (sel === 'clear-saved-splitter-2') {
      splitterSave2.clearPosition(uniqueId2);
    }

    // Clear position for all saved Splitters
    if (sel === 'clear-saved-splitter-all') {
      const splitter: any = document.createElement('ids-splitter');
      /**
       * To clear all saved positions,
       * It can run on any IdsSplitter `clearPositionAll()`
       */
      splitter.clearPositionAll();
    }
  });
});
