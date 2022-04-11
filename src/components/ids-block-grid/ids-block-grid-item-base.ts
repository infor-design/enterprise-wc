import IdsElement from '../../core/ids-element';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';

const Base = IdsKeyboardMixin(
  IdsThemeMixin(
    IdsEventsMixin(
      IdsSelectionMixin(
        IdsElement
      )
    )
  )
);

export default Base;
