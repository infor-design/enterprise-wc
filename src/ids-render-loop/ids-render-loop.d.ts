// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import IdsRenderLoopItem from './ids-render-loop-item'

export default class IdsRenderLoop {
  /** determines whether or not the loop is currently ticking */
  readonly doLoop: boolean;

  /** represents the total elapsed time this item has been registered */
  readonly elapsedTime: number;

  /** all currently-registered RenderLoop items */
  readonly items: Array<IdsRenderLoopItem>

  /** timestamp representing the time when the loop item was registered */
  readonly startTime: number | undefined;

  /** registers a RenderLoopItem with the loop */
  register(loopItem: IdsRenderLoopItem): void;

  /** removes a RenderLoopItem from the loop directly, or by using its id */
  remove(obj: IdsRenderLoopItem | string): void;

  /** starts the loop */
  start(): void;

  /** stops the loop */
  stop(): void;
}
