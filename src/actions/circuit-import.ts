import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";

import { SaveData } from "@/services/savedata/types";

export const ACTION_CIRCUIT_IMPORT = "@circuit/import" as const;
export const importCircuits = (
  circuitId: MaybeArray<string>,
  saveData: SaveData
) => ({
  type: ACTION_CIRCUIT_IMPORT,
  payload: { circuitIds: asArray(circuitId), saveData },
});
export type ImportCircuitAction = ReturnType<typeof importCircuits>;
export function isImportCircuitAction(
  action: AnyAction
): action is ImportCircuitAction {
  return action.type === ACTION_CIRCUIT_IMPORT;
}
