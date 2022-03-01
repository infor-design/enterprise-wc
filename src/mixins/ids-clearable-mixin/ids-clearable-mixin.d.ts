export class IdsClearableMixin {
  /** True if the input will display a clearable "X" button */
  clearable: boolean;

  /** True if the input will display a clearable "X" button while ALSO displayed as readonly */
  clearableForced: boolean;

  /** Clears the inner input field */
  clear(): void;

  /** Checks the input field's contents and refreshes Clearable Icon state */
  checkContents(): void;
}
