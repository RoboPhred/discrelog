import { NodeDefinitionSource } from "../../types";

const PinNodeDefinitionSources: NodeDefinitionSource[] = [
  require("./input").default,
  require("./output").default,
];

export default PinNodeDefinitionSources;
