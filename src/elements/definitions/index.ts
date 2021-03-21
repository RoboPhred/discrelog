import { ElementDefinitionSource } from "../types";

import IntegratedCircuitDefinitionSources from "./integrated-circuits";
import InteractionDefinitionSources from "./interaction";
import LogicDefinitionSources from "./logic";
import OutputDefinitionSources from "./output";
import PinDefinitionSources from "./pins";

const elementDefinitionSources: ElementDefinitionSource[] = [
  ...IntegratedCircuitDefinitionSources,
  ...InteractionDefinitionSources,
  ...LogicDefinitionSources,
  ...OutputDefinitionSources,
  ...PinDefinitionSources,
];

export default elementDefinitionSources;
