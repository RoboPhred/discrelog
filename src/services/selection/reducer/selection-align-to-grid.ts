import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";
import { pointEquals } from "@/geometry";

import { isSelectionAlignToGridAction } from "@/actions/selection-align-to-grid";
import { moveNode } from "@/actions/node-move";
import { moveWireJoint } from "@/actions/wire-joint-move";

import { nodePositionsByNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import {
  applyGridJointSnapSelector,
  applyGridNodeSnapSelector,
} from "@/services/circuit-editor-drag/selectors/snap";
import { wireJointPositionsByJointIdSelector } from "@/services/node-layout/selectors/wires";

export default function selectionAlignToGridReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionAlignToGridAction(action)) {
    return state;
  }

  const { selectedNodeIds, selectedJointIds } = state.services.selection;

  // Align nodes.
  const nodePositions = nodePositionsByNodeIdSelector(state);
  for (const nodeId of selectedNodeIds) {
    const nodePos = nodePositions[nodeId];
    if (!nodePos) {
      continue;
    }

    const snappedPos = applyGridNodeSnapSelector(state, nodePos);
    if (!pointEquals(nodePos, snappedPos)) {
      state = rootReducer(state, moveNode(nodeId, snappedPos));
    }
  }

  // Align joints.
  const jointPositions = wireJointPositionsByJointIdSelector(state);
  for (const jointId of selectedJointIds) {
    const jointPos = jointPositions[jointId];
    if (!jointPos) {
      continue;
    }

    const snappedPos = applyGridJointSnapSelector(state, jointPos);
    if (!pointEquals(jointPos, snappedPos)) {
      state = rootReducer(state, moveWireJoint(jointId, snappedPos));
    }
  }

  return state;
}
