import { NodeDefinitionSource } from "../types";

import InteractionNodeDefinitionSources from "./interaction";
import LogicNodeDefinitionSources from "./logic";
import OutputNodeDefinitionSources from "./output";
import PinNodeDefinitionSources from "./pins";

const nodeDefinitionSources: NodeDefinitionSource[] = [
  ...InteractionNodeDefinitionSources,
  ...LogicNodeDefinitionSources,
  ...OutputNodeDefinitionSources,
  ...PinNodeDefinitionSources,
];

export default nodeDefinitionSources;
