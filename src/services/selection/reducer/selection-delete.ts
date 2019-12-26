import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isSelectionDeleteAction } from "@/actions/selection-delete";
import { deleteNode } from "@/actions/node-delete";

import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";
import { detatchWire } from "@/actions/wire-detatch";

export default function selectionDeleteReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSelectionDeleteAction(action)) {
    return state;
  }

  const { selectionType, selectedIds } = state.services.selection;

  if (selectedIds.length === 0) {
    return state;
  }

  switch (selectionType) {
    case "nodes": {
      return rootReducer(state, deleteNode(selectedIds));
    }
    case "wires": {
      // TODO: Make detatchWire take multiple wires
      return selectedIds.reduce(
        (state, wireId) => rootReducer(state, detatchWire(wireId)),
        state
      );
    }
  }

  return state;
}
