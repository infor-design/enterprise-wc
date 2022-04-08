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
});
