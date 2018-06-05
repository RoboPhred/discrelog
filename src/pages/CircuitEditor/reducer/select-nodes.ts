import produce from "immer";

import { SelectNodesAction } from "../actions";
import { CircuitEditorState } from "../state";

import { combineSelection } from "./utils";

const selectNodesReducer = produce(
  (state: CircuitEditorState, action: SelectNodesAction) => {
    const { nodeIds, mode } = action.payload;
    state.selectedNodeIds = combineSelection(
      state.selectedNodeIds,
      nodeIds,
      mode
    );
  }
);
export default selectNodesReducer;
