import { NodeDefinitionSource } from "../../types";

const OutputNodeDefinitionSources: NodeDefinitionSource[] = [
  require("./led").default,
  require("./seg7").default,
];

export default OutputNodeDefinitionSources;
