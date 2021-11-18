// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export class IdsFocusCaptureMixin {
  /** True if the component should be capturing keyboard focus from external elements */
  capturesFocus: boolean;

  /** True if when navigating focusable items, focus will loop back/forth to the beginning/end respectively */
  cyclesFocus: boolean;

  /** A user-configurable list of CSS selectors representing elements that can be focusable within this one */
  focusableSelectors: Array<string>;

  /** Returns a list of elements matching this component's `focusableSelectors` array */
  focusableElements: Array<HTMLElement>;

  /** Reference to the first focusable element at the top of this components children */
  firstFocusableElement: HTMLElement | undefined;

  /** Reference to the last focusable element at the bottom of this components children */
  lastFocusableElement: HTMLElement | undefined;

  /** Reference to the next focusable element from the current activeElement (when this component is focused) */
  nextFocusableElement: HTMLElement | undefined;

  /** Reference to the previous focusable element from the current activeElement (when this component is focused) */
  previousFocusableElement: HTMLElement | undefined;

  /** Sets focus within this component to a specified index, or the first/last focusable items */
  setFocus(index: number | 'first' | 'last' | undefined): boolean;

  /** Sets focus on this component if a different element outside of this one has focus */
  gainFocus(index: number | 'first' | 'last' | undefined): boolean;
}
