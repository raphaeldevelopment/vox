import { createEffect } from "../src/dependency/index.js";
import { createVariable } from "../src/variables/index.js";
import { voxMain, VariableRegistry } from "../src/content/index.js";


const [x, setX] = createVariable(0);
const [y, setY] = createVariable("t");
const [inpt, setInpt] = createVariable(15);
const variableRegistry = VariableRegistry.getInstance();
variableRegistry.set("testing", x);
variableRegistry.set("test", y);
variableRegistry.set("inpt", inpt);
variableRegistry.set("setInpt", setInpt);

createEffect(() => {
    if ((x / 10) % 3 === 0) {
        setY(x * 2);
    }
}, [x]);

for (let i = 0; i < 10; i++)
    setTimeout(() => {
        setX(i * 10);
    }, i *1000)


voxMain();