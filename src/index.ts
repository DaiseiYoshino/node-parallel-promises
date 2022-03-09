// 呼び出す毎に1つPromiseを返す関数を返す関数
function* promiseFunctionArrayIterator (
  promiseFunctionArray: (() => Promise<any>)[]
): Generator<
  () => Promise<any>,
  () => Promise<any>,
  void
> {
  let tmp = [...promiseFunctionArray];
  while (0 < tmp.length) {
    yield tmp.shift();
  }
  return () => Promise.resolve();
}


let pa = [];
for(let i = 0; i < 100; i++) {
  pa.push(
    () => new Promise(
      resolve => {
        return setTimeout(resolve, 300, i)
      }
    )
  );
}

let iter = promiseFunctionArrayIterator(pa);

let resultArray = [];

function doPromiseFunction(result) {
    result ? resultArray.push(result) : null;
    let iterObj = iter.next();
    if (iterObj.done) {
      return Promise.resolve();
    } else {
      return iterObj.value();
    }
}

(
  async () => {
    let arr = [Promise.resolve(), Promise.resolve(), Promise.resolve()];

    for (let j=0; j < arr.length; j++) {
      for (let i = 0; i < pa.length; i++) {
        arr[j] = arr[j].then(doPromiseFunction)
      }
    }
    await Promise.all(arr);
    console.log(resultArray);
  }
)();