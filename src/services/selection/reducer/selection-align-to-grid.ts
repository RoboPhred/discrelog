import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";
import { pointEquals } from "@/geometry";

import { isSelectionAlignToGridAction } from "@/actions/selection-align-to-grid";

import { nodePositionsByNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import { applyGridSnapSelector } from "@/services/circuit-editor-ui/selectors/snap";
import { moveNode } from "@/actions/node-move";

export default function selectionAlignToGridReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionAlignToGridAction(action)) {
    return state;
  }

  const selectedNodeIds = state.services.selection.selectedNodeIds;

  // Align nodes.
  const nodePositions = nodePositionsByNodeIdSelector(state);
  for (const nodeId of selectedNodeIds) {
    const nodePos = nodePositions[nodeId];
    if (!nodePos) {
      continue;
    }

    const snappedPos = applyGridSnapSelector(state, nodePos);
    if (!pointEquals(nodePos, snappedPos)) {
      state = rootReducer(state, moveNode(nodeId, snappedPos));
    }
  }

  // TODO: Align joints.

  return state;
}
