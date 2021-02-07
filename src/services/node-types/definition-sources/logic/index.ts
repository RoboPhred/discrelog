import { NodeDefinitionSource } from "../../types";

const LogicNodeDefinitionSources: NodeDefinitionSource[] = [
  require("./and").default,
  require("./buffer").default,
  require("./nor").default,
  require("./not").default,
  require("./or").default,
  require("./xor").default,
];

export default LogicNodeDefinitionSources;
