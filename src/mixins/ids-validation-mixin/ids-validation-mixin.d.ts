export class IdsValidationMixin {
  /** Sets the validation check to use * */
  validate: 'required' | 'email' | string;

  /** Sets the validation events to use * */
  validationEvents: 'blur' | string;
}
