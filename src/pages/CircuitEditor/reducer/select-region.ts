import { AnyAction } from "redux";

import forOwn from "lodash/forOwn";

import { AppState } from "@/store";

import { intersects } from "@/geometry";

import { nodeRectsById } from "../selectors";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { isSelectRegionAction } from "../actions/select-region";

import { combineSelection } from "./utils";

export default function selectRegionReducer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction,
  appState: AppState
) {
  if (!isSelectRegionAction(action)) {
    return state;
  }

  const { region, mode } = action.payload;

  const rects = nodeRectsById(appState);
  const chosenIds: string[] = [];
  forOwn(rects, (rect, id) => {
    if (intersects(rect, region)) {
      chosenIds.push(id);
    }
  });

  return {
    ...state,
    selectedNodeIds: combineSelection(state.selectedNodeIds, chosenIds, mode)
  };
}
