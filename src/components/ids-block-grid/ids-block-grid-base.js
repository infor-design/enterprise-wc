import IdsElement from '../../core/ids-element';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

const Base = IdsPagerMixin(
  IdsEventsMixin(
    IdsElement
  )
);

export default Base;
