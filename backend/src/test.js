const promise = new Promise(function (resolve) {
  resolve('I am resolved');
});

promise.catch((reject) => console.log(reject));
promise.then((result) => console.log(result));
