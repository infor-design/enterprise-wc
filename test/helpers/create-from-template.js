/**
 * Jest helper function to create a web component with associated markup.
 * @param {HTMLElement} elem the dom element that will be replaced
 * @param {string} innerHTML the template
 * @returns {HTMLElement} the new root dom element
 */
const createFromTemplate = (elem, innerHTML) => {
  elem?.remove();
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  elem = template.content.childNodes[0];
  document.body.appendChild(elem);
  return elem;
};
export default createFromTemplate;
