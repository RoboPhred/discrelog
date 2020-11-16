import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isMoveSelectionAction } from "@/actions/selection-move";
import { moveNode } from "@/actions/node-move";
import { moveWireJoint } from "@/actions/wire-joint-move";

import {
  selectedNodeIdsSelector,
  selectedJointIdsSelector,
} from "@/services/selection/selectors/selection";

export default function selectionMoveReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isMoveSelectionAction(action)) {
    return state;
  }

  const { offsetX, offsetY } = action.payload;

  const nodeIds = selectedNodeIdsSelector(state);
  const jointIds = selectedJointIdsSelector(state);

  const offset: Point = {
    x: offsetX,
    y: offsetY,
  };

  state = rootReducer(state, moveNode(nodeIds, offset, true));
  state = rootReducer(state, moveWireJoint(jointIds, offset, true));

  return state;
}
