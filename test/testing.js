import { createVariable } from "../src/variables/index.js";
import { voxMain, VariableRegistry } from "../src/content/index.js";
import { CallbackRegistry } from "../src/utils/CallbackRegistry.js";

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

voxMain();