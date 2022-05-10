import IdsElement from '../../core/ids-element';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';

const Base = IdsThemeMixin(
  IdsLocaleMixin(
    IdsElement
  )
);

export default Base;
