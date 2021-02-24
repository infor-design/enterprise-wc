// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export class IdsResizeMixin {
  /** */
  observed: HTMLElement[];

  /** Sets up connection to the global ResizeObserver instance */
  setupResize(): void;

  /** Disconnects from the global ResizeObserver instance */
  disconnectResize(): void;

  /** Describes which base element contained by this component is being watched for Resize changes */
  resizeDetectionTarget(): HTMLElement;

  /** Adds an element to the global ResizeObserver instance for tracking, watched locally by this component */
  addObservedElement(el: HTMLElement): void;

  /** Removes an element watched locally by this component from the global ResizeObserver instance */
  removeObservedElement(el: HTMLElement): void;

  /** Removes all elements from the global ResizeObserver watched locally by this component */
  removeAllObservedElements(): void;

  /** Sets up connection to a shared MutationObserver instance */
  setupDetectMutations(): void;

  /** Disconnects from a shared MutationObserver instance */
  disconnectDetectMutations(): void;

  /** Describes whether or not this component should be allowed to detect mutation changes */
  shouldDetectMutations(): boolean;
}
