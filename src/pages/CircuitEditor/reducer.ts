
import produce from "immer";

import { CircuitEditorState, defaultCircuitEditorState } from "./state";

import {
    Actions,
    ACTION_NODE_MOVE,
    MoveNodeAction
} from "./actions";

const nodeMoveAction = produce((state: CircuitEditorState, action: MoveNodeAction) => {
    const {
        nodeId,
        x,
        y
    } = action.payload;
    const nodePosition = state.nodePositions[nodeId];
    if (!nodePosition) {
        return;
    }
    nodePosition.x = x;
    nodePosition.y = y;
});

export default function circuitEditorReducer(state: CircuitEditorState = defaultCircuitEditorState, action: Actions): CircuitEditorState {
    switch(action.type) {
        case ACTION_NODE_MOVE:
            return nodeMoveAction(state, action);
    }
    return state;
}
