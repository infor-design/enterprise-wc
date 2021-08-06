export class IdsColorVariantMixin {
  /** list of available color variants for this component */
  availableColorVariants: Array<string>;

  /** the current color variant */
  colorVariant: string;

  /** refreshes the Color Variant's state applied to the IdsElement container */
  refreshColorVariant(): void;
}
