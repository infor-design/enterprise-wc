import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsElement from '../../core/ids-element';
import IdsRippleMixin from '../../mixins/ids-ripple-mixin/ids-ripple-mixin';

const Base = IdsThemeMixin(
  IdsRippleMixin(
    IdsEventsMixin(
      IdsSelectionMixin(
        IdsElement
      )
    )
  )
);

export default Base;
