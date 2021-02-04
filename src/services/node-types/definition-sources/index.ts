import { NodeDefinitionSource } from "../types";

import IntegratedCircuitDefinitionSources from "./integrated-circuits";
import InteractionNodeDefinitionSources from "./interaction";
import LogicNodeDefinitionSources from "./logic";
import OutputNodeDefinitionSources from "./output";
import PinNodeDefinitionSources from "./pins";

const nodeDefinitionSources: NodeDefinitionSource[] = [
  ...IntegratedCircuitDefinitionSources,
  ...InteractionNodeDefinitionSources,
  ...LogicNodeDefinitionSources,
  ...OutputNodeDefinitionSources,
  ...PinNodeDefinitionSources,
];

export default nodeDefinitionSources;
