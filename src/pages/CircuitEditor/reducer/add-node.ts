import produce from "immer";

import { AddNodeAction } from "../actions";

import { CircuitEditorState } from "../state";

const addNodeReducer = produce(
  (state: CircuitEditorState, action: AddNodeAction) => {
    const { nodeId: id, x = 0, y = 0 } = action.payload;
    state.nodePositions[id] = {
      x,
      y
    };
  }
);
export default addNodeReducer;
