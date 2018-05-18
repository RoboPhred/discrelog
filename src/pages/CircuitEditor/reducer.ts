
import produce from "immer";

import { Actions as SimActions, ACTION_NODE_ADD, AddNodeAction } from "@/services/simulator/actions";

import { CircuitEditorState, defaultCircuitEditorState } from "./state";

import {
    Actions as EditorActions,
    ACTION_NODE_MOVE,
    MoveNodeAction
} from "./actions";

const addNodeAction = produce((state: CircuitEditorState, action: AddNodeAction) => {
    const {
        nodeId: id,
        x = 0,
        y = 0
    } = action.payload;

    state.nodePositions[id] = {
        x,
        y
    };
});

const moveNodeAction = produce((state: CircuitEditorState, action: MoveNodeAction) => {
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

export default function circuitEditorReducer(state: CircuitEditorState = defaultCircuitEditorState, action: EditorActions | SimActions): CircuitEditorState {
    switch(action.type) {
        case ACTION_NODE_ADD:
            return addNodeAction(state, action);
        case ACTION_NODE_MOVE:
            return moveNodeAction(state, action);
    }
    return state;
}
