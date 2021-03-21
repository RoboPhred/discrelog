import { ElementDefinitionSource } from "../../types";

const InteractionDefinitionSources: ElementDefinitionSource[] = [
  require("./momentary").default,
  require("./toggle").default,
];

export default InteractionDefinitionSources;
