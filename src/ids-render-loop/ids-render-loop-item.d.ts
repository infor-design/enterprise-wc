// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export default class IdsRenderLoopItem {
  /** lifespan of the renderloop item in miliseconds (defaults to -1, which means it has no duration)*/
  duration?: number;

  /** a unique identifier for the loop item */
  id?: string;

  /** specifies the interval in which the `updateCallback` will fire in miliseconds (defaults to 1) */
  updateDuration?: number;

  /** specifies a function to fire when the timer ends */
  timeoutCallback?: Function;

  /** determines whether or not the item is counting down its lifespan */
  readonly paused: boolean;

  /** timestamp representing the time when the loop item was registered */
  readonly startTime: number | undefined;

  /** represents the total elapsed time this item has been registered */
  readonly elapsedTime: number;

  /** describes the total time this component has been "stopped" */
  readonly totalStoppedTime?: number;

  /** destroys this RenderLoop Item and removes it from the queue */
  destroy(doTimeout?: boolean): void;

  /** pauses the loop item */
  pause(): void;

  /** resumes the loop item */
  resume(): void;

  /** programmatically causes a `timeoutCallback` to occur, if conditions allow */
  timeout(): void;

  /** programmatically causes an `updateCallback` to occur, if conditions allow */
  update(): void;
}
