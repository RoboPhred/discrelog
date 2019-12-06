import produce from "immer";

import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { MoveNodesAction } from "../actions";
import { CircuitEditorState } from "../state";

function moveNodeReducer(state: CircuitEditorState, action: MoveNodesAction) {
  const { nodeIds, offsetX, offsetY } = action.payload;
  const { nodePositions } = state;
  state.nodePositions = {
    ...nodePositions,
    ...mapValues(pick(nodePositions, nodeIds), p => ({
      x: p.x + offsetX,
      y: p.y + offsetY
    }))
  };
}

export default produce(moveNodeReducer);
