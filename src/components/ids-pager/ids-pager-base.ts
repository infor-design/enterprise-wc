import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

const Base = IdsThemeMixin(
  IdsEventsMixin(
    IdsElement
  )
);

export default Base;
