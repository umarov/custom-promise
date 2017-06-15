import { CustomPromise } from './custom-promise.js';

export class HttpPromise extends CustomPromise {
  constructor(method, url) {

    super((resolve, reject) => {
      const request = new XMLHttpRequest();

      try {
        request.open(method, url, true);
        request.onload = () => {
          if (request.readyState === 4) {
            if (request.status === 200) {
              resolve(request.responseText);
            } else {
              reject(request.responseText)
            }
          }
        }

        request.onerror = () => reject(request.statusText)
        request.send(null);
      } catch (exception) {
        reject(exception)
      }
    })
  }
}