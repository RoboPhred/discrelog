import { NodeDefinitionSource } from "../../types";

const PinNodeDefinitionSources: NodeDefinitionSource[] = [
  require("./high").default,
  require("./input").default,
  require("./output").default,
];

export default PinNodeDefinitionSources;
