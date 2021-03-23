import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";
import { pointEquals } from "@/geometry";

import { isSelectionAlignToGridAction } from "@/actions/selection-align-to-grid";
import { moveElement } from "@/actions/element-move";

import { elementPositionsByElementIdSelector } from "@/services/circuit-layout/selectors/element-positions";
import { applyGridElementSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";

export default function selectionAlignToGridReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionAlignToGridAction(action)) {
    return state;
  }

  const { selectedElementIds } = state.services.selection;

  // Align elements.
  const elementPositions = elementPositionsByElementIdSelector(state);
  for (const elementId of selectedElementIds) {
    const elementPos = elementPositions[elementId];
    if (!elementPos) {
      continue;
    }

    const snappedPos = applyGridElementSnapSelector(state, elementPos);
    if (!pointEquals(elementPos, snappedPos)) {
      state = rootReducer(state, moveElement(elementId, snappedPos));
    }
  }

  return state;
}
