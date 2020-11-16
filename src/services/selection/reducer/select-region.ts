import forOwn from "lodash/forOwn";

import { intersects, pointIntersects } from "@/geometry";

import { isSelectRegionAction } from "@/actions/select-region";

import { nodeRectsByIdSelector } from "@/services/circuit-layout/selectors/node-bounds";
import { wireJointPositionsByJointIdSelector } from "@/services/circuit-layout/selectors/wires";

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

  const chosenJointIds: string[] = [];
  const jointPositions = wireJointPositionsByJointIdSelector(appState);
  forOwn(jointPositions, (p, jointId) => {
    if (pointIntersects(p, region)) {
      chosenJointIds.push(jointId);
    }
  });

  return {
    ...state,
    selectedNodeIds: combineSelection(
      state.selectedNodeIds,
      chosenNodeIds,
      mode
    ),
    selectedConnectionIds: mode === "set" ? [] : state.selectedConnectionIds,
    selectedJointIds: combineSelection(
      state.selectedJointIds,
      chosenJointIds,
      mode
    ),
  };
});
