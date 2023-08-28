export class IdsDeferred {
  promise: Promise<any>;

  resolve: any;

  reject: any;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
