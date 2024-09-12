// 4.x demo
$('body').initialize();

$('#mock-header').notification({
  type: 'error',
  message: 'DTO rejected by your manager for Sept 30, 2025.',
  parent: '#mock-header',
  link: '#',
  linkText: 'Click to view',
  attributes: [
    { name: 'id', value: 'notification-id-1' },
    { name: 'data-automation-id', value: 'notification-automation-id-1' }
  ]
});

$('#mock-header').notification({
  type: 'info',
  message: 'DTO rejected by your manager for Sept 30, 2025. Please login to your Human Resources (HR) portal for an explanation on why. If you believe there was a mistake or wish to appeal the rejection, you can now also do that in the new HR portal. ',
  parent: '#mock-header',
  link: '#',
  linkText: 'Click to view',
  attributes: [
    { name: 'id', value: 'notification-id-2' },
    { name: 'data-automation-id', value: 'notification-automation-id-2' }
  ]
});

$('#mock-header').notification({
  type: 'alert',
  message: 'DTO rejected by your manager for Sept 30, 2025.',
  parent: '#mock-header',
  link: '#',
  linkText: 'Click to view',
  attributes: [
    { name: 'id', value: 'notification-id-3' },
    { name: 'data-automation-id', value: 'notification-automation-id-3' }
  ]
});

$('#mock-header').notification({
  type: 'success',
  message: 'DTO rejected by your manager for Sept 30, 2025.',
  parent: '#mock-header',
  link: '#',
  linkText: 'Click to view',
  attributes: [
    { name: 'id', value: 'notification-id-4' },
    { name: 'data-automation-id', value: 'notification-automation-id-4' }
  ]
});
