import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsLocaleMixin(
  IdsTooltipMixin(
    IdsElement
  )
);

export default Base;
