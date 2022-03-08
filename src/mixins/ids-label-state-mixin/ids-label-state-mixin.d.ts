type IdsLabelStates = null | 'hidden' | 'collapsed';

export class IdsLabelStateMixin {
  /** Determines the visibility state of this component's inner input field's label */
  labelState?: IdsLabelStates;
}
