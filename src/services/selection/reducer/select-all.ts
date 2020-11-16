import { isSelectAllAction } from "@/actions/select-all";

import { nodeIdsSelector } from "@/services/node-graph/selectors/nodes";
import { wireIdsSelector } from "@/services/node-graph/selectors/wires";
import { jointIdsSelector } from "@/services/node-layout/selectors/wires";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectAllAction(action)) {
    return state;
  }

  const nodeIds = nodeIdsSelector(appState);
  const wireIds = wireIdsSelector(appState);
  const jointIds = jointIdsSelector(appState);

  return {
    ...state,
    selectedNodeIds: nodeIds,
    selectedWireIds: wireIds,
    selectedJointIds: jointIds,
  };
});
