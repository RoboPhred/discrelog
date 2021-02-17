import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isMoveSelectionAction } from "@/actions/selection-move";
import { moveNode, MoveNodeOpts } from "@/actions/node-move";
import { moveWireJoint, MoveWireJointOpts } from "@/actions/wire-joint-move";

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

  const { offsetX, offsetY, snapMode } = action.payload;

  const nodeIds = selectedNodeIdsSelector(state);
  const jointIds = selectedJointIdsSelector(state);

  const offset: Point = {
    x: offsetX,
    y: offsetY,
  };

  let nodeSnapMode: MoveNodeOpts["snapMode"] = "none";
  if (snapMode === "node" || snapMode === "by-type") {
    nodeSnapMode = "node";
  }

  let jointSnapMode: MoveWireJointOpts["snapMode"] = "none";
  if (snapMode === "by-type") {
    jointSnapMode = "joint";
  } else {
    jointSnapMode = snapMode;
  }

  state = rootReducer(
    state,
    moveNode(nodeIds, offset, { relative: true, snapMode: nodeSnapMode })
  );
  state = rootReducer(
    state,
    moveWireJoint(jointIds, offset, { relative: true, snapMode: jointSnapMode })
  );

  return state;
}
