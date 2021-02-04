import { AppState } from "@/store";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { connectionIdsByCircuitIdSelector } from "@/services/circuits/selectors/connections";

import { editingCircuitIdSelector } from "./circuit";

export const nodeIdsForEditingCircuitSelector = (state: AppState) => {
  const editingCircuitId = editingCircuitIdSelector(state);
  const nodeIds = nodeIdsFromCircuitIdSelector(state, editingCircuitId);
  return nodeIds;
};

export const connectionIdsForEditingCircuitSelector = (state: AppState) => {
  const editingCircuitId = editingCircuitIdSelector(state);
  const connectionids = connectionIdsByCircuitIdSelector(
    state,
    editingCircuitId
  );
  return connectionids;
};
