import { ElementDefinitionSource } from "../../types";

const OutputElementDefinitionSources: ElementDefinitionSource[] = [
  require("./led").default,
  require("./seg7").default,
];

export default OutputElementDefinitionSources;
