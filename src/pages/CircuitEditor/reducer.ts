import produce from "immer";

import { forOwn } from "lodash-es";

import { intersects } from "@/geometry";

import { AppState } from "@/store";

import {
  Actions as SimActions,
  ACTION_NODE_ADD,
  AddNodeAction
} from "@/services/simulator/actions";

import {
  Actions as EditorActions,
  ACTION_NODE_MOUSEOVER,
  ACTION_NODE_MOVE,
  MouseOverNodeAction,
  MoveNodeAction,
  SelectRegionAction,
  ACTION_SELECT_REGION
} from "./actions";
import { nodeRectsById } from "./selectors";
import { CircuitEditorState, defaultCircuitEditorState } from "./state";

const addNodeAction = produce(
  (state: CircuitEditorState, action: AddNodeAction) => {
    const { nodeId: id, x = 0, y = 0 } = action.payload;
    state.nodePositions[id] = {
      x,
      y
    };
  }
);

const mouseOverNodeAction = produce(
  (state: CircuitEditorState, action: MouseOverNodeAction) => {
    state.mouseOverNodeId = action.payload.nodeId;
  }
);

const moveNodeAction = produce(
  (state: CircuitEditorState, action: MoveNodeAction) => {
    const { nodeId, x, y } = action.payload;
    const nodePosition = state.nodePositions[nodeId];
    if (!nodePosition) {
      return;
    }
    nodePosition.x = x;
    nodePosition.y = y;
  }
);

function selectRegionAction(
  state: CircuitEditorState,
  action: SelectRegionAction,
  appState: AppState
) {
  const { payload: selectRect } = action;

  const rects = nodeRectsById(appState);
  const selectedIds: string[] = [];
  forOwn(rects, (rect, id) => {
    if (intersects(rect, selectRect)) {
      selectedIds.push(id);
    }
  });

  // State is simple enough that we could
  //  spread-clone here,
  //  but using immer for the freeze/seal behavior.
  return produce(state, state => {
    state.selectedNodeIds = selectedIds;
  });
}

export default function circuitEditorReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: EditorActions | SimActions,
  appState: AppState
): CircuitEditorState {
  switch (action.type) {
    case ACTION_NODE_ADD:
      return addNodeAction(state, action);
    case ACTION_NODE_MOUSEOVER:
      return mouseOverNodeAction(state, action);
    case ACTION_NODE_MOVE:
      return moveNodeAction(state, action);
    case ACTION_SELECT_REGION:
      return selectRegionAction(state, action, appState);
  }
  return state;
}
