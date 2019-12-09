import forOwn from "lodash/forOwn";

import { intersects } from "@/geometry";

import { nodeRectsByIdSelector } from "../selectors";
import { isSelectRegionAction } from "../actions/select-region";

import { combineSelection, createEditorReducer } from "./utils";

export default createEditorReducer((state, action, appState) => {
  if (!isSelectRegionAction(action)) {
    return state;
  }

  const { region, mode } = action.payload;

  const rects = nodeRectsByIdSelector(appState);
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
});
