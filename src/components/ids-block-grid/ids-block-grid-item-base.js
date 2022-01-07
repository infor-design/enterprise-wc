import IdsElement from '../../core/ids-element';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';

const Base = IdsThemeMixin(
  IdsEventsMixin(
    IdsSelectionMixin(
      IdsElement
    )
  )
);

export default Base;
