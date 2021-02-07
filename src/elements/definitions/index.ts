import { ElementDefinition } from "../types";

export * from "./element-led";
export * from "./element-toggle";

export const ElementDefinitionsByType = {
  and: require("./element-and").default as ElementDefinition,
  or: require("./element-or").default as ElementDefinition,
  nor: require("./element-nor").default as ElementDefinition,
  not: require("./element-not").default as ElementDefinition,
  buffer: require("./element-buffer").default as ElementDefinition,
  led: require("./element-led").default as ElementDefinition,
  toggle: require("./element-toggle").default as ElementDefinition,
  seg7: require("./element-seg7").default as ElementDefinition,
  xor: require("./element-xor").default as ElementDefinition,
};
export type ElementType = keyof typeof ElementDefinitionsByType;
