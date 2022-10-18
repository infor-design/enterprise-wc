import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

const Base = IdsLocaleMixin(
  IdsTooltipMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

export default Base;
