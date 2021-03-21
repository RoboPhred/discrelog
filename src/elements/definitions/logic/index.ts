import { ElementDefinitionSource } from "../../types";

const LogicElementDefinitionSources: ElementDefinitionSource[] = [
  require("./and").default,
  require("./buffer").default,
  require("./nand").default,
  require("./nor").default,
  require("./not").default,
  require("./or").default,
  require("./xor").default,
];

export default LogicElementDefinitionSources;
