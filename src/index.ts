// 呼び出す毎に1つPromiseオブジェクトを返す関数
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

}

