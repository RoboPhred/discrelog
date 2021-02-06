import difference from "lodash/difference";
import pick from "lodash/pick";

import { AppState } from "@/store";

import {
  nodeInputConnectionIdsFromNodeIdSelector,
  nodeOutputConnectionIdsFromNodeIdSelector,
} from "@/services/node-graph/selectors/connections";

import { NodeLayoutState } from "../../state";

export default function nodeDelete(
  state: NodeLayoutState,
  nodeIds: string[],
  rootState: AppState
): NodeLayoutState {
  const remainingNodeIds = difference(
    Object.keys(state.nodePositionsById),
    nodeIds
  );

  // This logic has to duplicate the wire removal procedure from
  //  wire-detatch.ts.
  // We might want to just call that reducer from here.

  const removingConnectionIds = nodeIds.reduce((connectionIds, nodeId) => {
    const inputs = nodeInputConnectionIdsFromNodeIdSelector(rootState, nodeId);
    connectionIds.push(...inputs);

    const outputs = nodeOutputConnectionIdsFromNodeIdSelector(
      rootState,
      nodeId
    );
    connectionIds.push(...outputs);

    return connectionIds;
  }, [] as string[]);

  const removingJointIds = removingConnectionIds.reduce(
    (jointIds, connectionId) => {
      jointIds.push(...state.wireJointIdsByConnectionId[connectionId]);
      return jointIds;
    },
    [] as string[]
  );

  const remainingConnectionIds = difference(
    Object.keys(state.wireJointIdsByConnectionId),
    removingConnectionIds
  );

  const remainingJointIds = difference(
    Object.keys(state.wireJointPositionsByJointId),
    removingJointIds
  );

  return {
    ...state,
    nodePositionsById: pick(state.nodePositionsById, remainingNodeIds),
    wireJointIdsByConnectionId: pick(
      state.wireJointIdsByConnectionId,
      remainingConnectionIds
    ),
    wireJointPositionsByJointId: pick(
      state.wireJointPositionsByJointId,
      remainingJointIds
    ),
  };
}
