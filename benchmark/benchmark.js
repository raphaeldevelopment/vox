import { createVariable, createEffect, batch } from "../dist/vox.esm.js";

const output = document.getElementById("output");
const runBtn = document.getElementById("runBtn");

function log(...args) {
  const line = args.map(v => String(v)).join(" ");
  output.textContent += line + "\n";
  console.log(...args);
}

function clearLog() {
  output.textContent = "";
}

function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

async function benchmark(name, fn, runs = 10) {
  const times = [];

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / runs;
  const min = Math.min(...times);
  const max = Math.max(...times);

  log("");
  log(name);
  log(`avg: ${avg.toFixed(2)}ms`);
  log(`min: ${min.toFixed(2)}ms`);
  log(`max: ${max.toFixed(2)}ms`);
}

async function runBenchmarks() {
  clearLog();
  log("=== VOX DERIVED CHAIN BENCHMARKS ===");

  await benchmark("1 source -> 1k derived chain + single flush", async () => {
    const CHAIN_LENGTH = 1000;

    const [source, setSource] = createVariable(0);
    let prev = source;

    for (let i = 0; i < CHAIN_LENGTH; i++) {
      const currentPrev = prev;
      const [derived] = createVariable(
        () => currentPrev.getValue() + 1,
        [currentPrev]
      );
      prev = derived;
    }

    let finalValue = null;

    createEffect(() => {
      finalValue = prev.getValue();
    }, [prev]);

    setSource(1);
    await nextFrame();

    log("finalValue =", finalValue);
  });

  await benchmark("1 source -> 1k derived chain + 100 writes batched", async () => {
    const CHAIN_LENGTH = 1000;

    const [source, setSource] = createVariable(0);
    let prev = source;

    for (let i = 0; i < CHAIN_LENGTH; i++) {
      const currentPrev = prev;
      const [derived] = createVariable(
        () => currentPrev.getValue() + 1,
        [currentPrev]
      );
      prev = derived;
    }

    let effectRuns = 0;
    let finalValue = null;

    createEffect(() => {
      effectRuns++;
      finalValue = prev.getValue();
    }, [prev]);

    batch(() => {
      for (let i = 1; i <= 100; i++) {
        setSource(i);
      }
    });

    await nextFrame();

    log("effect runs =", effectRuns);
    log("finalValue =", finalValue);
  });

  await benchmark("1 source -> 1k derived chain + 100 writes unbatched", async () => {
    const CHAIN_LENGTH = 1000;

    const [source, setSource] = createVariable(0);
    let prev = source;

    for (let i = 0; i < CHAIN_LENGTH; i++) {
      const currentPrev = prev;
      const [derived] = createVariable(
        () => currentPrev.getValue() + 1,
        [currentPrev]
      );
      prev = derived;
    }

    let effectRuns = 0;
    let finalValue = null;

    createEffect(() => {
      effectRuns++;
      finalValue = prev.getValue();
    }, [prev]);

    for (let i = 1; i <= 100; i++) {
      setSource(i);
      await nextFrame();
    }

    log("effect runs =", effectRuns);
    log("finalValue =", finalValue);
  });

  log("");
  log("Benchmark complet.");
}

runBtn.addEventListener("click", () => {
  runBenchmarks().catch(err => {
    console.error(err);
    log("");
    log("Eroare:", err.message);
  });
});