import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { isMoveSelectionAction } from "@/actions/selection-move";
import {
  selectedNodeIdsSelector,
  selectedJointIdsSelector,
} from "@/services/selection/selectors/selection";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action, appState) => {
  if (!isMoveSelectionAction(action)) {
    return state;
  }

  const { offsetX, offsetY } = action.payload;

  const nodeIds = selectedNodeIdsSelector(appState);
  const movedNodePositions = mapValues(
    pick(state.nodePositionsById, nodeIds),
    (p) => ({
      x: p.x + offsetX,
      y: p.y + offsetY,
    })
  );

  const jointIds = selectedJointIdsSelector(appState);
  const movedJoints = mapValues(
    pick(state.wireJointPositionsByJointId, jointIds),
    (p) => ({
      x: p.x + offsetX,
      y: p.y + offsetY,
    })
  );

  return {
    ...state,
    nodePositionsById: {
      ...state.nodePositionsById,
      ...movedNodePositions,
    },
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      ...movedJoints,
    },
  };
});
