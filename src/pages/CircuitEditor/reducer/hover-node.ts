import produce from "immer";

import { HoverNodeAction } from "../actions";
import { CircuitEditorState } from "../state";

const hoverNodeReducer = produce(
  (state: CircuitEditorState, action: HoverNodeAction) => {
    state.mouseOverNodeId = action.payload.nodeId;
  }
);
export default hoverNodeReducer;
