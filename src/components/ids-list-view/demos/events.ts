// Supporting components
import '../ids-list-view';
import '../../ids-radio/ids-radio';
import productsJSON from '../../../assets/data/products-100.json';

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
  const radioBeforeItemActivated: any = document.querySelector('#radio-lv-beforeactivated');

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
    show('beforedeselected', e.detail);
  });
  // after deselected
  listView.addEventListener('deselected', (e: any) => {
    show('deselected', e.detail);
  });
  // before item activated
  listView.addEventListener('beforeactivated', (e: any) => {
    const veto = radioBeforeItemActivated.value;
    show('beforeactivated', e.detail, veto);
    e.detail.response(veto);
  });
  // after item activated
  listView.addEventListener('activated', (e: any) => {
    show('activated', e.detail);
  });
  // before item deactivated
  listView.addEventListener('beforedeactivated', (e: any) => {
    show('beforedeactivated', e.detail);
  });
  // after item deactivated
  listView.addEventListener('deactivated', (e: any) => {
    show('deactivated', e.detail);
  });
}
