// Supporting components
import IdsBreadcrumb from '../ids-breadcrumb';
import IdsHyperlink from '../../ids-hyperlink/ids-hyperlink';
import IdsButton from '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const breadcrumb = document.querySelector('ids-breadcrumb');
  breadcrumb.onBreadcrumbActivate = (targetEl, previousEl) => {
    console.info(`New Breadcrumb: "${targetEl.textContent}"\nPrevious Breadcrumb: "${previousEl.textContent}"`);
  };
});
