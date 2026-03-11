import { createVariable, createEffect } from "../dist/vox.esm.js";

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

    console.log(`\n${name}`);
    console.log(`avg: ${avg.toFixed(2)}ms`);
    console.log(`min: ${min.toFixed(2)}ms`);
    console.log(`max: ${max.toFixed(2)}ms`);
}

console.log("=== VOX BENCHMARKS ===");

await benchmark("10k variable writes + flush", async () => {
    const [value, setValue] = createVariable(0);

    for (let i = 0; i < 10000; i++) {
        setValue(i);
    }

    await nextFrame();
});

await benchmark("1k effects creation", async () => {
    for (let i = 0; i < 1000; i++) {
        const [value] = createVariable(i);
        createEffect(() => {
            value.getValue();
        }, [value]);
    }

    await nextFrame();
});

await benchmark("100 nodes x 100 updates + flush", async () => {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);

    const [value, setValue] = createVariable(0);
    let runs = 0;

    for (let i = 0; i < 100; i++) {
        const node = document.createElement("span");
        wrapper.appendChild(node);

        createEffect(() => {
            runs++;
            node.textContent = String(value.getValue());
        }, [value]);
    }

    for (let i = 0; i < 100; i++) {
        setValue(i);
    }

    await nextFrame();

    console.log("effect runs =", runs);
    wrapper.remove();
});

await benchmark("100 nodes x 100 updates unbatched", async () => {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);

    const [value, setValue] = createVariable(0);
    let runs = 0;

    for (let i = 0; i < 100; i++) {
        const node = document.createElement("span");
        wrapper.appendChild(node);

        createEffect(() => {
            runs++;
            node.textContent = String(value.getValue());
        }, [value]);
    }

    for (let i = 0; i < 100; i++) {
        setValue(i);
        await new Promise(resolve => requestAnimationFrame(resolve));
    }

    console.log("effect runs =", runs);
    wrapper.remove();
});