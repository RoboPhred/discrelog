import { AnyAction } from "redux";

import { Point } from "@/geometry";
import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isMoveSelectionAction } from "@/actions/selection-move";
import { moveElement, MoveElementOpts } from "@/actions/element-move";
import {
  moveConnectionJoint,
  MoveConnectionJointOpts,
} from "@/actions/connection-joint-move";

import {
  selectedElementIdsSelector,
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

  const elementIds = selectedElementIdsSelector(state);
  const jointIds = selectedJointIdsSelector(state);

  const offset: Point = {
    x: offsetX,
    y: offsetY,
  };

  let elementSnapMode: MoveElementOpts["snapMode"] = "none";
  if (snapMode === "element" || snapMode === "by-type") {
    elementSnapMode = "element";
  }

  let jointSnapMode: MoveConnectionJointOpts["snapMode"] = "none";
  if (snapMode === "by-type") {
    jointSnapMode = "joint";
  } else {
    jointSnapMode = snapMode;
  }

  state = rootReducer(
    state,
    moveElement(elementIds, offset, {
      relative: true,
      snapMode: elementSnapMode,
    })
  );
  state = rootReducer(
    state,
    moveConnectionJoint(jointIds, offset, {
      relative: true,
      snapMode: jointSnapMode,
    })
  );

  return state;
}
