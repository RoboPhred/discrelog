import forOwn from "lodash/forOwn";
import pick from "lodash/pick";

import { intersects, pointIntersects } from "@/geometry";
import { combineSelection } from "@/selection-mode";

import { isSelectRegionAction } from "@/actions/select-region";

import { elementIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/elements";
import { elementRectsByIdSelector } from "@/services/circuit-layout/selectors/element-bounds";
import { wireJointPositionByJointIdSelector } from "@/services/circuit-graph/selectors/wire-positions";
import { wireJointIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/wires";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectRegionAction(action)) {
    return state;
  }

  const { region, circuitId, mode } = action.payload;

  const elementIds = elementIdsFromCircuitIdSelector(appState, circuitId);
  const rects = pick(elementRectsByIdSelector(appState), elementIds);

  const chosenElementIds: string[] = [];
  forOwn(rects, (rect, elementId) => {
    if (intersects(rect, region)) {
      chosenElementIds.push(elementId);
    }
  });

  const jointIds = wireJointIdsFromCircuitIdSelector(appState, circuitId);
  const jointPositions = pick(
    wireJointPositionByJointIdSelector(appState),
    jointIds
  );
  const chosenJointIds: string[] = [];
  forOwn(jointPositions, (p, jointId) => {
    if (pointIntersects(p, region)) {
      chosenJointIds.push(jointId);
    }
  });

  return {
    ...state,
    selectedElementIds: combineSelection(
      state.selectedElementIds,
      chosenElementIds,
      mode
    ),
    selectedJointIds: combineSelection(
      state.selectedJointIds,
      chosenJointIds,
      mode
    ),
  };
});
