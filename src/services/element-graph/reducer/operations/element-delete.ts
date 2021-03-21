import pick from "lodash/pick";
import difference from "lodash/difference";
import pickBy from "lodash/pickBy";
import flatMap from "lodash/flatMap";

import { AppState } from "@/store";

import { ElementGraphServiceState } from "../../state";
import { Connection, elementPinEquals } from "../../types";
import { elementPinsFromPinElementSelector } from "../../selectors/pins";

export default function nodeDelete(
  state: ElementGraphServiceState,
  elementIds: string[],
  rootState: AppState
): ElementGraphServiceState {
  const remainingElementIds = difference(
    Object.keys(state.elementsById),
    elementIds
  );

  const removedIcPins = flatMap(elementIds, (elementId) =>
    elementPinsFromPinElementSelector(rootState, elementId)
  );

  function isRemainingConnection({ inputPin, outputPin }: Connection) {
    if (
      elementIds.indexOf(inputPin.elementId) !== -1 ||
      elementIds.indexOf(outputPin.elementId) !== -1
    ) {
      // Connection went to a removed node
      return false;
    }

    // Connection was to a removed node pin
    if (
      removedIcPins.some(
        (pin) =>
          elementPinEquals(pin, inputPin) || elementPinEquals(pin, outputPin)
      )
    ) {
      return false;
    }

    return true;
  }

  return {
    ...state,
    elementsById: pick(state.elementsById, remainingElementIds),
    connectionsById: pickBy(state.connectionsById, isRemainingConnection),
  };
}
