import { SaveCircuit } from "@/services/savedata/types";

export interface ImportProjectCircuitsDialogData {
  circuits: SaveCircuit[];
}

export type ImportProjectCircuitsDialogResult = string[];
