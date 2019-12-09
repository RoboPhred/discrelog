import { AnyAction, Reducer } from "redux";

import union from "lodash/union";
import difference from "lodash/difference";

import { fpSet } from "@/utils";
import { AppState, defaultAppState } from "@/store";

import { SelectionMode } from "../types";
import { CircuitEditorState } from "../state";

export interface CircuitEditorReducer {
  (
    state: CircuitEditorState,
    action: AnyAction,
    appState: AppState
  ): CircuitEditorState;
}

export function createEditorReducer(
  reducer: CircuitEditorReducer
): Reducer<AppState, AnyAction> {
  return (state: AppState = defaultAppState, action: AnyAction) => {
    const newEditorState = reducer(state.ui.circuitEditor, action, state);
    if (state.ui.circuitEditor != newEditorState) {
      return fpSet(state, "ui", "circuitEditor", newEditorState);
    }
    return state;
  };
}

export function combineSelection(
  selectedIds: string[],
  chosenIds: string[],
  mode: SelectionMode
) {
  switch (mode) {
    case "set":
      return chosenIds;
    case "append":
      return union(selectedIds, chosenIds);
    case "remove":
      return difference(selectedIds, chosenIds);
    case "toggle": {
      return difference(selectedIds, chosenIds).concat(
        difference(chosenIds, selectedIds)
      );
    }
  }

  return chosenIds;
}
