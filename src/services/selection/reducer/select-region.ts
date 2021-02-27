import forOwn from "lodash/forOwn";
import pick from "lodash/pick";

import { intersects, pointIntersects } from "@/geometry";
import { combineSelection } from "@/selection-mode";

import { isSelectRegionAction } from "@/actions/select-region";

import { nodeIdsForEditingCircuitSelector } from "@/services/circuit-editor-ui-viewport/selectors/nodes";
import { nodeRectsByIdSelector } from "@/services/node-layout/selectors/node-bounds";
import { wireJointPositionsByJointIdSelector } from "@/services/node-layout/selectors/wires";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectRegionAction(action)) {
    return state;
  }

  const { region, mode } = action.payload;

  const nodeIds = nodeIdsForEditingCircuitSelector(appState);
  const rects = pick(nodeRectsByIdSelector(appState), nodeIds);

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
