import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsDirtyTrackerMixin(
  IdsThemeMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

export default Base;
