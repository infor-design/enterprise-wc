// Supporting components
// import '../ids-input/ids-input.js';
// import '../ids-toggle-button/ids-toggle-button.js';
// import '../ids-icon/ids-icon.js';
// import '../ids-hyperlink/ids-hyperlink.js';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});
