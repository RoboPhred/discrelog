import produce from "immer";

import { ClearSelectionAction } from "../actions";
import { CircuitEditorState } from "../state";

const clearSelectionReducer = produce(
  (state: CircuitEditorState, action: ClearSelectionAction) => {
    state.selectedNodeIds = [];
  }
);
export default clearSelectionReducer;
