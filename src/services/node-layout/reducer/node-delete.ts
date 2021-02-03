import pick from "lodash/pick";
import difference from "lodash/difference";

import { PRIORITY_PRE, reducerPriority } from "@/store/priorities";

import { isDeleteNodeAction } from "@/actions/node-delete";

import {
  nodeInputConnectionIdsFromNodeIdSelector,
  nodeOutputConnectionIdsFromNodeIdSelector,
} from "@/services/node-graph/selectors/connections";

import { createNodeLayoutReducer } from "../utils";

// We need to run this reducer before graph runs, as we want to check what wires are connected to the node being deleted.
export default reducerPriority(
  PRIORITY_PRE,
  createNodeLayoutReducer((state, action, appState) => {
    if (!isDeleteNodeAction(action)) {
      return state;
    }

    const { nodeIds } = action.payload;

    const remainingNodeIds = difference(
      Object.keys(state.nodePositionsById),
      nodeIds
    );

    // This logic has to duplicate the wire removal procedure from
    //  wire-detatch.ts.
    // We might want to just call that reducer from here.

    const removingConnectionIds = nodeIds.reduce((connectionIds, nodeId) => {
      const inputs = nodeInputConnectionIdsFromNodeIdSelector(appState, nodeId);
      connectionIds.push(...inputs);

      const outputs = nodeOutputConnectionIdsFromNodeIdSelector(
        appState,
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
  })
);
