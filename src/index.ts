// 呼び出す毎に1つPromiseオブジェクトを返す関数
function* promiseArrayIterator (promiseArray: Promise<any>[]): Generator<Promise<any>, Promise<any>, boolean> {
  let tmp = [...promiseArray];
  while (0 < tmp.length) {
    yield tmp.shift();
  }
  return Promise.resolve()
}

