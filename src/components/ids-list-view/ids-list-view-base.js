import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsSortableMixin from '../../mixins/ids-sortable-mixin/ids-sortable-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsThemeMixin(
  IdsSortableMixin(
    IdsKeyboardMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

export default Base;
