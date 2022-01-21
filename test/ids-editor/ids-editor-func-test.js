/**
 * @jest-environment jsdom
 */
import ResizeObserver from '../helpers/resize-observer-mock';
import wait from '../helpers/wait';
// import processAnimFrame from '../helpers/process-anim-frame';

import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsEditor from '../../src/components/ids-editor/ids-editor';

document.execCommand = jest.fn();

describe('IdsEditor Component', () => {
  let container;
  let editor;

  beforeEach(async () => {
    const elem = new IdsEditor();
    container = new IdsContainer();
    container.appendChild(elem);
    document.body.appendChild(container);
    editor = container.querySelector('ids-editor');
    await container.setLanguage('en');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsEditor();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-editor').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should be able to get current value', async () => {
    expect(editor.value).toEqual('');
    const template = document.createElement('template');
    template.innerHTML = '<div slot="content"><p>test</p></div>';
    editor.appendChild(template.content.childNodes[0]);
    await wait(500);
    expect(editor.value).toEqual('<p>test</p>\n');
  });

  it('should sets as disabled state', () => {
    expect(editor.getAttribute('disabled')).toEqual(null);
    expect(editor.container.getAttribute('disabled')).toEqual(null);
    expect(editor.disabled).toEqual(false);
    editor.disabled = true;
    expect(editor.getAttribute('disabled')).toEqual('');
    expect(editor.container.getAttribute('disabled')).toEqual('');
    expect(editor.disabled).toEqual(true);
    editor.disabled = false;
    expect(editor.getAttribute('disabled')).toEqual(null);
    expect(editor.container.getAttribute('disabled')).toEqual(null);
    expect(editor.disabled).toEqual(false);
  });

  it('should sets the label text', () => {
    const labelEl = editor.container.querySelector('#editor-label');
    const sourceLabelEl = editor.container.querySelector('[for="source-textarea"]');
    const sourceTextareaLabel = (str) => `${str} - HTML Source View`;
    const label = 'test';
    const d = { label: 'Ids editor' };
    d.sourceLabel = sourceTextareaLabel(d.label);
    const sourceLabel = sourceTextareaLabel(label);
    expect(editor.getAttribute('label')).toEqual(null);
    expect(labelEl.textContent.trim()).toEqual(d.label);
    expect(sourceLabelEl.textContent.trim()).toEqual(d.sourceLabel);
    editor.label = label;
    expect(editor.getAttribute('label')).toEqual(label);
    expect(labelEl.textContent.trim()).toEqual(label);
    expect(sourceLabelEl.textContent.trim()).toEqual(sourceLabel);
    editor.label = null;
    expect(editor.getAttribute('label')).toEqual(null);
    expect(labelEl.textContent.trim()).toEqual(d.label);
    expect(sourceLabelEl.textContent.trim()).toEqual(d.sourceLabel);
  });

  it('should sets as readonly state', () => {
    expect(editor.getAttribute('readonly')).toEqual(null);
    expect(editor.container.getAttribute('readonly')).toEqual(null);
    expect(editor.readonly).toEqual(false);
    editor.readonly = true;
    expect(editor.getAttribute('readonly')).toEqual('');
    expect(editor.container.getAttribute('readonly')).toEqual('');
    expect(editor.readonly).toEqual(true);
    editor.readonly = false;
    expect(editor.getAttribute('readonly')).toEqual(null);
    expect(editor.container.getAttribute('readonly')).toEqual(null);
    expect(editor.readonly).toEqual(false);
  });
});
