import { voxMain, createVariable, createEffect, State, VariableRegistry, CallbackRegistry, voxDebug } from "../dist/vox.esm.js"

const variableRegistry = VariableRegistry.getInstance();
const callbackRegistry = CallbackRegistry.getInstance();

const [name, setName] = createVariable("Raphael");
const [isVisible, setIsVisible] = createVariable(true);
const [items, setItems] = createVariable(["Ana", "Ion", "Maria"]);

variableRegistry.set("name", name);
callbackRegistry.set("name", setName);

variableRegistry.set("isVisible", isVisible);

variableRegistry.set("items", items);

callbackRegistry.set("toggleVisible", () => {
  setIsVisible(!isVisible.getValue());
});

callbackRegistry.set("addItem", () => {
  const currentItems = items.getValue();
  const nextIndex = currentItems.length + 1;

  setItems([...currentItems, `Item ${nextIndex}`]);
});

const state = State.getInstance();

console.log("\n1. Create state 'user'");
state.create("user");
console.log(state.get());

console.log("\n2. Add variables");
state.addVariable("user", "name", "Ana");
state.addVariable("user", "age", 25);

console.log(state.get("user"));

createEffect((...args) => {
    console.log("FROM STATE, BOSS", args);
}, [state.get("user").name])
console.log(state.get("user").name);
console.log("\n3. Read values");
console.log("name:", state.get("user").name);
console.log("age:", state.get("user").age);

console.log("\n4. Modify values");
state.get("user").name = "Maria";
state.get("user").age = 26;

console.log(state.get("user"));

console.log("\n5. Save manually");
state.save();

console.log("\n7. Full root");
console.log(state.get());

console.log("=== END TEST STATE ===");

voxMain();

voxDebug();