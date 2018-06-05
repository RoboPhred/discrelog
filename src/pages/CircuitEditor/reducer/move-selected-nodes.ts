import produce from "immer";
import { mapValues, pick } from "lodash-es";

import { MoveNodeAction } from "../actions";
import { CircuitEditorState } from "../state";

const moveSelectedNodesReducer = produce(
  (state: CircuitEditorState, action: MoveNodeAction) => {
    const { offsetX, offsetY } = action.payload;
    const { nodePositions, selectedNodeIds } = state;
    state.nodePositions = {
      ...nodePositions,
      ...mapValues(pick(nodePositions, selectedNodeIds), p => ({
        x: p.x + offsetX,
        y: p.y + offsetY
      }))
    };
  }
);
export default moveSelectedNodesReducer;
