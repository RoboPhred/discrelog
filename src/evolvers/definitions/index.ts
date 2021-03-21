import { EvolverDefinition } from "../types";

function asEvolverDef(module: any): EvolverDefinition {
  return module.default as EvolverDefinition;
}

export const EvolverDefinitionsByType = {
  "input-momentary": asEvolverDef(require("./input-momentary")),
  "input-toggle": asEvolverDef(require("./input-toggle")),

  "logic-and": asEvolverDef(require("./logic-and")),
  "logic-buffer": asEvolverDef(require("./logic-buffer")),
  "logic-nand": asEvolverDef(require("./logic-nand")),
  "logic-nor": asEvolverDef(require("./logic-nor")),
  "logic-not": asEvolverDef(require("./logic-not")),
  "logic-or": asEvolverDef(require("./logic-or")),
  "logic-xor": asEvolverDef(require("./logic-xor")),

  "output-led": asEvolverDef(require("./output-led")),
  "output-seg7": asEvolverDef(require("./output-seg7")),

  "pin-high": asEvolverDef(require("./pin-high")),
};
export type EvolverType = keyof typeof EvolverDefinitionsByType;
