document.addEventListener('DOMContentLoaded', () => {
  const breadcrumb: any = document.querySelector('ids-breadcrumb');
  breadcrumb.onBreadcrumbActivate = (targetEl: any, previousEl: any) => {
    console.info(`New Breadcrumb: "${targetEl.textContent}"\nPrevious Breadcrumb: "${previousEl.textContent}"`);
  };
});
