import { isSelectAllAction } from "@/actions/select-all";

import { nodeIdsSelector } from "@/services/circuit-graph/selectors/nodes";
import { connectionIdsSelector } from "@/services/circuit-graph/selectors/connections";
import { jointIdsSelector } from "@/services/circuit-layout/selectors/wires";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectAllAction(action)) {
    return state;
  }

  const nodeIds = nodeIdsSelector(appState);
  const connectionIds = connectionIdsSelector(appState);
  const jointIds = jointIdsSelector(appState);

  return {
    ...state,
    selectedNodeIds: nodeIds,
    selectedConnectionIds: connectionIds,
    selectedJointIds: jointIds,
  };
});
