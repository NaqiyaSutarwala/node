const { Worker, isMainThread, workerData } = require("worker_threads");

if (isMainThread) {
  console.log(`Main thread Process id: ${process.pid}`);

  new Worker(__filename, {
    workerData: [7, 6, 2, 3, 6, 5, 98, 56, 97],
  });
  new Worker(__filename, {
    workerData: [7, 12, 69, 78, 13, 659, 74, 12, 487, 21, 7],
  });
} else {
  console.log(`Worker thread Process id: ${process.pid}`);
  console.log(`${workerData} sorted is ${workerData.sort()}`);
}
