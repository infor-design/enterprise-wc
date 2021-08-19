export class IdsXssMixin {
  /** A string containing whatever HTML tags should be left alone while processing */
  xssIgnoredTags: string;

  /** Processes a string against this component's internal list of allowed tags */
  xssSanitize(inputVal?: string): string;
}
