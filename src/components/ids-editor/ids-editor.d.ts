/** Type for editor modal */
type IdsEditorTypeModal = {
  /** The hyperlink options */
  hyperlink?: {
    /** Url for hyperlink */
    url?: string,

    /** Css Class for hyperlink */
    class?: string,

    /** List target options for hyperlink */
    targets?: Array<object>,

    /** If true, isClickable checkbox should checked */
    isClickable?: boolean,

    /** If true, will show isClickable checkbox */
    showIsClickable?: boolean
  },

  /** The insertimage options */
  insertimage?: {
    /** Url for insertimage */
    url?: string,

    /** Alt text for insertimage */
    alt?: string,
  }
}

/** Type for editor vetoable event */
interface IdsEditorEventVetoable extends Event {
  detail: {
    /** Editor element */
    elem: IdsEditor,

    /** Extra data with vetoable event */
    data: {
      /** Editor current value */
      value: string

      /** Editor current view mode */
      view: string

      /** Editor current pasted data */
      pastedData?: string
    }

    /** The method to run for vetoable  */
    response: () => boolean
  }
}

/** Type for editor event detail */
interface IdsEditorEventDetail extends Event {
  detail: {
    /** Editor element */
    elem: IdsEditor,

    /** Editor current value */
    value: string

    /** Editor current view mode */
    view?: string

    /** Editor current pasted data */
    pastedData?: string
  }
}

export default class IdsEditor extends HTMLElement {
  /** Sets the editor to disabled state */
  disabled: boolean | string;

  /** Set the editor aria label text */
  label: string | null;

  /** Set the label to be hidden or shown */
  labelHidden: boolean | string;

  /** Set required indicator (red '*') to be hidden or shown */
  labelRequired: boolean | string;

  /** Set the placeholder text for editor */
  paragraphSeparator: string | null;

  /** Sets the editor node to be selectable */
  placeholder: string | null;

  /** Sets the editor to readonly state */
  readonly: boolean | string;

  /** Sets to be use source formatter for editor */
  sourceFormatter: boolean | null;

  /** Set the view mode for editor */
  view: string | 'editor' | 'source' | null;

  /** Get editor current value */
  readonly value: string;

  /** Set default value to each element in modals */
  modalElementsValue(modals: IdsEditorTypeModal): HTMLElement;

  /** Get label text for source textarea */
  sourceTextareaLabel(): string;

  /** Fires before change view to editor mode, you can return false in the response to veto */
  on(event: 'beforeeditormode', listener: (detail: IdsEditorEventVetoable) => void): this;

  /** Fires after change view to editor mode */
  on(event: 'aftereditormode', listener: (detail: IdsEditorEventDetail) => void): this;

  /** Fires before change view to source mode, you can return false in the response to veto */
  on(event: 'beforesourcemode', listener: (detail: IdsEditorEventVetoable) => void): this;

  /** Fires after change view to source mode */
  on(event: 'aftersourcemode', listener: (detail: IdsEditorEventDetail) => void): this;

  /** Fires after requested view mode changed */
  on(event: 'viewchanged', listener: (detail: IdsEditorEventDetail) => void): this;

  /** Fires if requested view mode rejected */
  on(event: 'rejectviewchanged', listener: (detail: IdsEditorEventDetail) => void): this;

  /** Fires before paste, you can return false in the response to veto */
  on(event: 'beforepaste', listener: (detail: IdsEditorEventVetoable) => void): this;

  /** Fires after paste */
  on(event: 'afterpaste', listener: (detail: IdsEditorEventDetail) => void): this;

  /** Fires if rejected paste content */
  on(event: 'rejectpaste', listener: (detail: IdsEditorEventDetail) => void): this;

  /** Fires after value changed */
  on(event: 'change', listener: (detail: IdsEditorEventDetail) => void): this;
}
