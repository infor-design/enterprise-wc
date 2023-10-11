/**
 * Promise wrapper class that allows resolving/rejecting the promise externally
 */
export class IdsDeferred {
  // Reference to the promise object
  promise: Promise<any>;

  // Reference to the promise's internal resolve fn
  resolve: any;

  // Reference to the promise's internal reject fn
  reject: any;

  // Promise state
  hasResolved = false;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (args: any) => {
        this.hasResolved = true;
        resolve(args);
      };

      this.reject = (args: any) => {
        this.hasResolved = false;
        reject(args);
      };
    });
  }
}
