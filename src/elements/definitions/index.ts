import { ElementDefinition } from "../types";

function asElementDef(module: any): ElementDefinition {
  return module.default as ElementDefinition;
}

export const ElementDefinitionsByType = {
  "input-momentary": asElementDef(require("./input-momentary")),
  "input-toggle": asElementDef(require("./input-toggle")),

  "logic-and": asElementDef(require("./logic-and")),
  "logic-buffer": asElementDef(require("./logic-buffer")),
  "logic-nand": asElementDef(require("./logic-nand")),
  "logic-nor": asElementDef(require("./logic-nor")),
  "logic-not": asElementDef(require("./logic-not")),
  "logic-or": asElementDef(require("./logic-or")),
  "logic-xor": asElementDef(require("./logic-xor")),

  "output-led": asElementDef(require("./output-led")),
  "output-seg7": asElementDef(require("./output-seg7")),

  "pin-high": asElementDef(require("./pin-high")),
};
export type ElementType = keyof typeof ElementDefinitionsByType;
