import { AnyAction } from "redux";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { selectNodes } from "@/pages/CircuitEditor/actions/select-nodes";

import { isDragStartNodeAction } from "../actions/drag-start-node";

export default function dragNodesStartReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isDragStartNodeAction(action)) {
    return state;
  }

  const { nodeId, x, y, selectionMode } = action.payload;

  let fieldState = state.ui.circuitEditor.circuitField;
  fieldState = {
    ...fieldState,
    dragMode: "move-node",
    dragStart: {
      x,
      y
    }
  };
  state = fpSet(state, "ui", "circuitEditor", "circuitField", fieldState);

  return rootReducer(state, selectNodes(nodeId, selectionMode));
}
