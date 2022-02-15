// Supporting components
import IdsBreadcrumb from '../ids-breadcrumb';
import IdsHyperlink from "../../ids-hyperlink/ids-hyperlink";

const [button1, button2] = document.querySelectorAll('ids-button');
const breadcrumb = document.querySelector('ids-breadcrumb');
const checkbox = document.querySelector('ids-checkbox');
button1.onclick = () => {
  const link = document.createElement('ids-hyperlink');
  link.innerText = `Breadcrumb ${breadcrumb.children.length + 1}`;
  link.href = '#';
  if (checkbox.checked) link.disabled = '';
  breadcrumb.add(link);
};

button2.onclick = () => breadcrumb.delete();
