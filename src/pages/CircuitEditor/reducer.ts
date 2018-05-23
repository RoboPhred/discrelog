import produce from "immer";

import { forOwn, union, difference, mapValues, pick } from "lodash-es";

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
  ACTION_MOVE_SELECTED,
  MouseOverNodeAction,
  MoveNodeAction,
  SelectRegionAction,
  ACTION_SELECT_REGION,
  SelectActionModifiers,
  SelectNodeAction,
  ClearSelectionAction,
  ACTION_SELECT_CLEAR,
  ACTION_SELECT_NODE
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

const moveSelectedAction = produce(
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

const selectNodeAction = produce(
  (state: CircuitEditorState, action: SelectNodeAction) => {
    const { nodeId, modifiers = {} } = action.payload;
    const nodeIds = nodeId != null ? [nodeId] : [];
    state.selectedNodeIds = combineSelection(
      state.selectedNodeIds,
      nodeIds,
      modifiers
    );
  }
);

function selectRegionAction(
  state: CircuitEditorState,
  action: SelectRegionAction,
  appState: AppState
) {
  const { region, modifiers = {} } = action.payload;

  const rects = nodeRectsById(appState);
  const chosenIds: string[] = [];
  forOwn(rects, (rect, id) => {
    if (intersects(rect, region)) {
      chosenIds.push(id);
    }
  });

  // State is simple enough that we could
  //  spread-clone here,
  //  but using immer for the freeze/seal behavior.
  return produce(state, state => {
    state.selectedNodeIds = combineSelection(
      state.selectedNodeIds,
      chosenIds,
      modifiers
    );
  });
}

const clearSelectionAction = produce(
  (state: CircuitEditorState, action: ClearSelectionAction) => {
    state.selectedNodeIds = [];
  }
);

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
    case ACTION_MOVE_SELECTED:
      return moveSelectedAction(state, action);
    case ACTION_SELECT_NODE:
      return selectNodeAction(state, action);
    case ACTION_SELECT_REGION:
      return selectRegionAction(state, action, appState);
    case ACTION_SELECT_CLEAR:
      return clearSelectionAction(state, action);
  }
  return state;
}

function combineSelection(
  selectedIds: string[],
  chosenIds: string[],
  modifiers: SelectActionModifiers
) {
  if (modifiers.append) {
    return union(selectedIds, chosenIds);
  }
  if (modifiers.remove) {
    return difference(selectedIds, chosenIds);
  }

  return chosenIds;
}
