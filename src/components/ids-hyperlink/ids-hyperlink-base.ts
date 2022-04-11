import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsHitboxMixin from '../../mixins/ids-hitbox-mixin/ids-hitbox-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsHitboxMixin(
  IdsColorVariantMixin(
    IdsThemeMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

export default Base;
