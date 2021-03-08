import forOwn from "lodash/forOwn";
import pick from "lodash/pick";

import { intersects, pointIntersects } from "@/geometry";
import { combineSelection } from "@/selection-mode";

import { isSelectRegionAction } from "@/actions/select-region";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { nodeRectsByIdSelector } from "@/services/node-layout/selectors/node-bounds";
import {
  wireJointPositionsByJointIdSelector,
  jointIdsFromCircuitIdSelector,
} from "@/services/node-layout/selectors/wires";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectRegionAction(action)) {
    return state;
  }

  const { region, circuitId, mode } = action.payload;

  const nodeIds = nodeIdsFromCircuitIdSelector(appState, circuitId);
  const rects = pick(nodeRectsByIdSelector(appState), nodeIds);

  const chosenNodeIds: string[] = [];
  forOwn(rects, (rect, id) => {
    if (intersects(rect, region)) {
      chosenNodeIds.push(id);
    }
  });

  const jointPositions = wireJointPositionsByJointIdSelector(appState);
  const jointIds = jointIdsFromCircuitIdSelector(appState, circuitId);
  const chosenJointIds = jointIds.filter((jointId) => {
    const position = jointPositions[jointId];
    return pointIntersects(position, region);
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
