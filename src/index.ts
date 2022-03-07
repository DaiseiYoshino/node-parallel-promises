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
    pa.push(() => new Promise(resolve => setTimeout(resolve, i*200)));
}

let iter = promiseFunctionArrayIterator(pa);

function doPromiseFunction() {
    let iterObj = iter.next();
    if (iterObj.done) {
      return Promise.resolve();
    } else {
      iterObj.value();
    }
}

(
  async () => {
    let arr = [Promise.resolve('a'), Promise.resolve('b'), Promise.resolve('c')];
    
  }
)();