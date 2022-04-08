import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';

const Base = IdsThemeMixin(
  IdsEventsMixin(
    IdsElement
  )
);

export default Base;
