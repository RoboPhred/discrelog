import difference from "lodash/difference";
import pick from "lodash/pick";
import flatMap from "lodash/flatMap";

import { AppState } from "@/store";

import {
  connectionsByIdSelector,
  nodeInputConnectionIdsFromNodeIdSelector,
  nodeOutputConnectionIdsFromNodeIdSelector,
} from "@/services/node-graph/selectors/connections";

import { NodeLayoutServiceState } from "../../state";
import { nodePinsFromPinNodeSelector } from "@/services/node-graph/selectors/pins";
import { nodePinEquals } from "@/services/node-graph/types";

export default function nodeDelete(
  state: NodeLayoutServiceState,
  nodeIds: string[],
  rootState: AppState
): NodeLayoutServiceState {
  const removedIcPins = flatMap(nodeIds, (nodeId) =>
    nodePinsFromPinNodeSelector(rootState, nodeId)
  );

  // This logic has to duplicate the wire removal procedure from
  //  wire-detatch.ts.
  // We might want to just call that reducer from here.

  const removingNodeConnectionIds = nodeIds.reduce((connectionIds, nodeId) => {
    const inputs = nodeInputConnectionIdsFromNodeIdSelector(rootState, nodeId);
    connectionIds.push(...inputs);

    const outputs = nodeOutputConnectionIdsFromNodeIdSelector(
      rootState,
      nodeId
    );
    connectionIds.push(...outputs);

    return connectionIds;
  }, [] as string[]);

  const connectionsById = connectionsByIdSelector(rootState);
  const removingPinConnectionIds = Object.keys(connectionsById).filter(
    (connectionId) => {
      const { inputPin, outputPin } = connectionsById[connectionId];
      return removedIcPins.some(
        (removedPin) =>
          nodePinEquals(removedPin, inputPin) ||
          nodePinEquals(removedPin, outputPin)
      );
    }
  );

  const removingConnectionIds = [
    ...removingNodeConnectionIds,
    ...removingPinConnectionIds,
  ];

  const removingJointIds = removingConnectionIds.reduce(
    (jointIds, connectionId) => {
      jointIds.push(...state.wireJointIdsByConnectionId[connectionId]);
      return jointIds;
    },
    [] as string[]
  );

  const remainingConnectionIds = difference(
    Object.keys(state.wireJointIdsByConnectionId),
    removingNodeConnectionIds
  );

  const remainingJointIds = difference(
    Object.keys(state.wireJointPositionsByJointId),
    removingJointIds
  );

  const remainingNodeIds = difference(
    Object.keys(state.nodePositionsById),
    nodeIds
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
