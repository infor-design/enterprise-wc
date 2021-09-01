// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsStepChart extends IdsElement {
  /**
   * sets the color of completed steps using
   * predefined ids color variables
   */
  color: string;

  /**
   * sets the step chart's secondary label
   */
  completeLabel: string;

  /**
   * sets the step chart's primary label
   */
  label: string;

  /**
   * sets the color of steps marked as in progress using
   * predifined ids color variables
   */
  progressColor: string;

  /**
   * array of steps that should be marked as in progress
   */
  stepsInProgress: Array<string|number>;

  /**
   * number of steps that should be displayed by the step chart
   */
  stepNumber: string;

  /**
   * steps up to the provided number
   * will be marked as complete unless already in progress
   */
  value: string;
}
