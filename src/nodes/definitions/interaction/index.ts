import { NodeDefinitionSource } from "../../types";

const InteractionNodeDefinitionSources: NodeDefinitionSource[] = [
  require("./momentary").default,
  require("./toggle").default,
];

export default InteractionNodeDefinitionSources;
