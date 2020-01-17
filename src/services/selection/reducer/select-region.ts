import forOwn from "lodash/forOwn";

import { intersects } from "@/geometry";

import { isSelectRegionAction } from "@/actions/select-region";

import { nodeRectsByIdSelector } from "@/services/field/selectors/bounds";

import { combineSelection, createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectRegionAction(action)) {
    return state;
  }

  const { region, mode } = action.payload;

  const rects = nodeRectsByIdSelector(appState);
  const chosenNodeIds: string[] = [];
  forOwn(rects, (rect, id) => {
    if (intersects(rect, region)) {
      chosenNodeIds.push(id);
    }
  });

  // TODO: Region select joints

  return {
    ...state,
    selectedNodeIds: combineSelection(
      state.selectedNodeIds,
      chosenNodeIds,
      mode
    ),
    selectedWireIds: mode === "set" ? [] : state.selectedWireIds,
    selectedJointIds: mode === "set" ? [] : state.selectedJointIds
  };
});
