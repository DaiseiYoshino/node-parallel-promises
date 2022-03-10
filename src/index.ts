type promiseFunction = () => Promise<any>;
type promiseFunctionGenerator = Generator<
  promiseFunction,
  promiseFunction,
  void
>;

class ParallelPromises {
  private functionsNumber: number;
  private functionsIterator: promiseFunctionGenerator;
  private parallelsNumber: number;
  private results: any[];

  constructor (
    functionsArray: promiseFunction[]
  ) {
    this.functionsNumber = functionsArray.length;
    this.functionsIterator = this.promiseFunctionArrayIterator([...functionsArray]);
    this.results = [];

    return this;
  }

  /**
   * 並列数を設定する用の関数
   *
   * @param num 並列数
   * @returns 
   */
  setParallelsNumber(num: number): this {
    this.parallelsNumber = num;
    return this;
  }  

  /**
   * 呼び出しごとに1つ関数を戻すジェネレータ
   *
   * @param functionsArray 関数列
   * @returns {promiseFunction}
   */
  private *promiseFunctionArrayIterator (
    functionsArray: promiseFunction[]
  ): promiseFunctionGenerator {
    let tmp: promiseFunction[] = [...functionsArray];
    while (0 < tmp.length) {
      yield tmp.shift();
    }
    return () => Promise.resolve();
  }

  /**
   * 関数列から一つ関数を読み出し、実行する
   *
   * @param result 前のPromiseの結果
   * @returns {Promise<any>}
   */
  doFunction(result: any): Promise<any> {
    result ? this.results.push(result) : null;
    const iterObj: IteratorResult<promiseFunction, promiseFunction> = this.functionsIterator.next();
    if (iterObj.done) {
      return Promise.resolve();
    } else {
      return iterObj.value();
    }
  }

  /**
   * 並列処理を実行する
   *
   * @returns {Promise<any[]>}
   */
  async run(): Promise<any[]> {
    let parallel: Promise<any>[] = [];
    for (let i=0; i<this.parallelsNumber; i++) {
      parallel.push(Promise.resolve());
    }

    for (let i=0; i<this.functionsNumber; i++) {
      for (let j=0; j<parallel.length; j++) {
        parallel[j] = parallel[j].then(this.doFunction.bind(this));
      }
    }

    await Promise.all(parallel);
    return this.results;
  }
}

module.exports = ParallelPromises;
