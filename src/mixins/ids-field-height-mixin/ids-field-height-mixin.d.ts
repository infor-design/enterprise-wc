type IdsFieldHeights = 'md' | 'xs' | 'sm' | 'lg';

export class IdsFieldHeightMixin {
  /** True if the input field on this component should be set to "compact" mode */
  compact: boolean;

  /** Determines the base field height of this component (default 'md') */
  fieldHeight: IdsFieldHeights;

  /** User-defined callback function that runs when the fieldHeight or compact proprties are modified */
  onFieldHeightChange?(targetFieldHeight?: IdsFieldHeights): void;
}
