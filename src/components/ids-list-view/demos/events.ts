// Supporting components
import '../ids-list-view';
import '../../ids-radio/ids-radio';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the List View
const listView: any = document.querySelector('#demo-lv-events');

if (listView) {
  // Do an ajax request and apply the data to the list
  const url: any = productsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    listView.data = data;
  };
  setData();

  /**
   * EVENTS
   */
  const radioBeforeSelected: any = document.querySelector('#radio-lv-beforeselected');
  const radioBeforeDeselected: any = document.querySelector('#radio-lv-beforedeselected');
  const radioBeforeItemActivated: any = document.querySelector('#radio-lv-beforeitemactivated');
  const radioBeforeItemDeactivated: any = document.querySelector('#radio-lv-beforeitemdeactivated');

  // display console logs
  const show = (type: string, detail: string, veto?: boolean) => {
    const showVeto = typeof veto !== 'undefined' ? `veto: ${veto}` : '';
    console.info(type, (detail ?? ''), showVeto);
  };

  // before selected
  listView.addEventListener('beforeselected', (e: any) => {
    const veto: boolean = radioBeforeSelected.value;
    show('beforeselected', e.detail, veto);
    e.detail.response(veto);
  });
  // after selected
  listView.addEventListener('selected', (e: any) => {
    show('selected', e.detail);
  });
  // before deselected
  listView.addEventListener('beforedeselected', (e: any) => {
    const veto = radioBeforeDeselected.value;
    show('beforedeselected', e.detail, veto);
    e.detail.response(veto);
  });
  // after deselected
  listView.addEventListener('deselected', (e: any) => {
    show('deselected', e.detail);
  });
  // before item activated
  listView.addEventListener('beforeitemactivated', (e: any) => {
    const veto = radioBeforeItemActivated.value;
    show('beforeitemactivated', e.detail, veto);
    e.detail.response(veto);
  });
  // after item activated
  listView.addEventListener('itemactivated', (e: any) => {
    show('itemactivated', e.detail);
  });
  // before item deactivated
  listView.addEventListener('beforeitemdeactivated', (e: any) => {
    const veto = radioBeforeItemDeactivated.value;
    show('beforeitemdeactivated', e.detail, veto);
    e.detail.response(veto);
  });
  // after item deactivated
  listView.addEventListener('itemdeactivated', (e: any) => {
    show('itemdeactivated', e.detail);
  });
  // after selection changed
  listView.addEventListener('selectionchanged', (e: any) => {
    show('selectionchanged', e.detail);
  });
}
