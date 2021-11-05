export class IdsOrientationMixin {
  /** list of available orientations for this component */
  orientations: Array<string>;

  /** the current orientation */
  orientation: string;

  /** refreshes the orientation's state applied to the IdsElement container */
  onOrientationRefresh?(): void;
}
