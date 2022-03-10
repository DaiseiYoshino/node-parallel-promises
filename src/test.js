let ParallelPromises = require('./index.js');

let pa = [];
for(let i = 0; i < 100; i++) {
  pa.push(
    () => new Promise(
      resolve => {
        return setTimeout(resolve, 50, i)
      }
    )
  );
}

(async () => {
  const pp = new ParallelPromises(pa);
  console.log(await pp.setParallelsNumber(5).run())
})();
