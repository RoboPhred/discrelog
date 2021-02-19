import pick from "lodash/pick";
import difference from "lodash/difference";
import pickBy from "lodash/pickBy";
import flatMap from "lodash/flatMap";

import { AppState } from "@/store";

import { NodeGraphServiceState } from "../../state";
import { Connection, nodePinEquals } from "../../types";
import { nodePinsFromPinNodeSelector } from "../../selectors/pins";

export default function nodeDelete(
  state: NodeGraphServiceState,
  nodeIds: string[],
  rootState: AppState
): NodeGraphServiceState {
  const remainingNodeIds = difference(Object.keys(state.nodesById), nodeIds);

  const removedIcPins = flatMap(nodeIds, (nodeId) =>
    nodePinsFromPinNodeSelector(rootState, nodeId)
  );

  function isRemainingConnection({ inputPin, outputPin }: Connection) {
    if (
      nodeIds.indexOf(inputPin.nodeId) !== -1 ||
      nodeIds.indexOf(outputPin.nodeId) !== -1
    ) {
      // Connection went to a removed node
      return false;
    }

    // Connection was to a removed node pin
    if (
      removedIcPins.some(
        (pin) => nodePinEquals(pin, inputPin) || nodePinEquals(pin, outputPin)
      )
    ) {
      return false;
    }

    return true;
  }

  return {
    ...state,
    nodesById: pick(state.nodesById, remainingNodeIds),
    connectionsById: pickBy(state.connectionsById, isRemainingConnection),
  };
}
