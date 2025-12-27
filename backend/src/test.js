const promise = new Promise(function(resolve, reject){
  resolve('I am resolved');
});

promise.catch((reject) => console.log(reject));
promise.then((result) => console.log(result));
