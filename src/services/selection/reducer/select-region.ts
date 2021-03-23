import forOwn from "lodash/forOwn";
import pick from "lodash/pick";

import { intersects } from "@/geometry";
import { combineSelection } from "@/selection-mode";

import { isSelectRegionAction } from "@/actions/select-region";

import { elementIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/elements";
import { elementRectsByIdSelector } from "@/services/circuit-layout/selectors/element-bounds";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectRegionAction(action)) {
    return state;
  }

  const { region, circuitId, mode } = action.payload;

  const elementIds = elementIdsFromCircuitIdSelector(appState, circuitId);
  const rects = pick(elementRectsByIdSelector(appState), elementIds);

  const chosenElementIds: string[] = [];
  forOwn(rects, (rect, id) => {
    if (intersects(rect, region)) {
      chosenElementIds.push(id);
    }
  });

  return {
    ...state,
    selectedElementIds: combineSelection(
      state.selectedElementIds,
      chosenElementIds,
      mode
    ),
  };
});
