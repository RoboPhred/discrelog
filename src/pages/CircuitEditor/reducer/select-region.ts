import produce from "immer";

import forOwn from "lodash/forOwn";

import { AppState } from "@/store";

import { intersects } from "@/geometry";

import { nodeRectsById } from "../selectors";

import { SelectRegionAction } from "../actions";
import { CircuitEditorState } from "../state";

import { combineSelection } from "./utils";

export default function selectRegionReducer(
  state: CircuitEditorState,
  action: SelectRegionAction,
  appState: AppState
) {
  const { region, mode } = action.payload;

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
      mode
    );
  });
}
