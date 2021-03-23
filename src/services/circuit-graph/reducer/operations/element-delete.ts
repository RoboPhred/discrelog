import pick from "lodash/pick";
import difference from "lodash/difference";
import pickBy from "lodash/pickBy";
import flatMap from "lodash/flatMap";
import mapValues from "lodash/mapValues";

import { AppState } from "@/store";

import { CircuitGraphServiceState } from "../../state";
import { ElementConnection, elementPinEquals } from "../../types";
import { elementPinsFromPinElementSelector } from "../../selectors/pins";

export default function elementDelete(
  state: CircuitGraphServiceState,
  elementIds: string[],
  rootState: AppState
): CircuitGraphServiceState {
  // TODO WIRE: Remove wire segments connected to elements being removed.
  // TODO WIRE: Remove wire segments connected to pins of pin elements being removed.

  const remainingElementIds = difference(
    Object.keys(state.elementsById),
    elementIds
  );

  const removedIcPins = flatMap(elementIds, (elementId) =>
    elementPinsFromPinElementSelector(rootState, elementId)
  );

  function isRemainingConnection({ inputPin, outputPin }: ElementConnection) {
    if (
      elementIds.indexOf(inputPin.elementId) !== -1 ||
      elementIds.indexOf(outputPin.elementId) !== -1
    ) {
      // Connection went to a removed element
      return false;
    }

    // Connection was to a removed element pin
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

  const elementIdsByCircuitId = mapValues(
    state.elementIdsByCircuitId,
    (circuitElementIds) => difference(circuitElementIds, elementIds)
  );

  return {
    ...state,
    elementsById: pick(state.elementsById, remainingElementIds),
    connectionsById: pickBy(state.connectionsById, isRemainingConnection),
    elementIdsByCircuitId,
  };
}
