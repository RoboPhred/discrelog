import { ElementDefinitionSource } from "../../types";

const PinElementDefinitionSources: ElementDefinitionSource[] = [
  require("./high").default,
  require("./input").default,
  require("./output").default,
];

export default PinElementDefinitionSources;
