import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { createCircuitLayoutReducer } from "../utils";
import {
  nodeInputWireIdsFromNodeIdSelector,
  nodeOutputWireIdsFromNodeIdSelector,
} from "@/services/circuit-graph/selectors/wires";
import { PRIORITY_PRE, reducerPriority } from "@/store/priorities";

// We need to run this reducer before graph runs, as we want to check what wires are connected to the node being deleted.
export default reducerPriority(
  PRIORITY_PRE,
  createCircuitLayoutReducer((state, action, appState) => {
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

    const removingWireIds = nodeIds.reduce((wireIds, nodeId) => {
      const inputs = nodeInputWireIdsFromNodeIdSelector(appState, nodeId);
      wireIds.push(...inputs);

      const outputs = nodeOutputWireIdsFromNodeIdSelector(appState, nodeId);
      wireIds.push(...outputs);

      return wireIds;
    }, [] as string[]);

    const removingJointIds = removingWireIds.reduce((jointIds, wireId) => {
      jointIds.push(...state.wireJointIdsByWireId[wireId]);
      return jointIds;
    }, [] as string[]);

    const remainingWireIds = difference(
      Object.keys(state.wireJointIdsByWireId),
      removingWireIds
    );

    const remainingJointIds = difference(
      Object.keys(state.wireJointPositionsByJointId),
      removingJointIds
    );

    return {
      ...state,
      nodePositionsById: pick(state.nodePositionsById, remainingNodeIds),
      wireJointIdsByWireId: pick(state.wireJointIdsByWireId, remainingWireIds),
      wireJointPositionsByJointId: pick(
        state.wireJointPositionsByJointId,
        remainingJointIds
      ),
    };
  })
);
