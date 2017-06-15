export class CustomPromise {
  static get promiseState() {
    return {
      pending: "pending",
      fulfilled: "fulfilled",
      rejected: "rejected"
    };
  }

  constructor(promiseBody) {
    this.thenables = {};
    this.value = undefined;

    try {
      this.status = CustomPromise.promiseState.pending;
      requestIdleCallback(() => promiseBody(this.resolve.bind(this), this.reject.bind(this)));
    } catch (exception) {
      this.reject(exception)
    }
  }

  resolve(resolvedValue) {
    requestIdleCallback(() => {
      this.status = CustomPromise.promiseState.fulfilled;
      this.value = resolvedValue;

      if (typeof this.thenables.onFulfilled === 'function') {
        this.thenables.onFulfilled(resolvedValue);
      }
    });
  }

  reject(rejectedValue) {
    requestIdleCallback(() => {
      this.status = CustomPromise.promiseState.rejected;
      this.value = rejectedValue;

      if (this.value) {
        if (typeof this.thenables.onRejected === 'function') {
          this.thenables.onRejected(rejectedValue);
        } else {
            throw `You did not provide a catch: ${this.value}`;
        }
      }
    });
  }

  then(thenBlock, catchBlock) {
    return new CustomPromise((resolve, reject) => {

      try {
        if (typeof catchBlock === 'function') {
          this.thenables.onRejected = this._onRejectedBuilder(catchBlock)(reject)
        }

        if (typeof thenBlock === 'function') {
          this.thenables.onFulfilled = this._onFulfilledBuilder(thenBlock)(resolve)
        }
      } catch (exception) {
        if (typeof catchBlock === 'function') {
          this.value = exception
          this.thenables.onRejected = this._onRejectedBuilder(catchBlock)(reject)
        }
      }
    })
  }

  _onFulfilledBuilder(thenAction) {
    return resolve => value => resolve(thenAction(value));
  }

  _onRejectedBuilder(catchAction) {
    return reject => value => reject(catchAction(value));
  }
}



