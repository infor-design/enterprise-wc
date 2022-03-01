import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsHitboxMixin from '../../mixins/ids-hitbox-mixin/ids-hitbox-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsHitboxMixin(
  IdsThemeMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

export default Base;
