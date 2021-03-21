import { AppState } from "@/store";

import {
  connectionFromConnectionIdSelector,
  connectionIdFromInputPinSelector,
} from "@/services/element-graph/selectors/connections";
import { elementTypeFromElementIdSelector } from "@/services/element-graph/selectors/elements";

import { elementOutputsFromCircuitElementIdSelector } from "./elements";
import { ElementPin } from "@/services/element-graph/types";

// Doesn't need caching for react since it returns primitives, but
// the additional complexity of tracing IC pins might make it a bit heavy.
export const wireValueFromConnectionIdSelector = (
  state: AppState,
  icElementPath: string[],
  connectionId: string
): boolean => {
  const connection = connectionFromConnectionIdSelector(state, connectionId);
  if (!connection) {
    return false;
  }

  const {
    outputPin: { elementId, pinId },
  } = connection;

  const elementType = elementTypeFromElementIdSelector(state, elementId);
  if (elementType === "pin-input") {
    // TODO: The ultimate connection id from the input pin is a good candidate
    // for caching in its own selector, as the ultimate source connection
    // id of a pin is something that only changes with the simulator graph.

    // The element id of the ic is the ic-element we are contained in.
    const nextIcElementPath = icElementPath.slice(0, icElementPath.length - 1);
    const nextPin: ElementPin = {
      elementId: icElementPath[icElementPath.length - 1], // target element is our parent.
      pinId: elementId, // target pin is the same as the element id for the input element.
    };

    const nextConnectionId = connectionIdFromInputPinSelector(state, nextPin);
    if (!nextConnectionId) {
      return false;
    }

    return wireValueFromConnectionIdSelector(
      state,
      nextIcElementPath,
      nextConnectionId
    );
  } else if (elementType?.startsWith("ic-")) {
    // Target the ic our output comes from
    const nextIcElementPath = [...icElementPath, elementId];
    const nextPin: ElementPin = {
      elementId: pinId, // output element id is the same as the target pin id
      pinId: "IN",
    };

    const nextConnectionId = connectionIdFromInputPinSelector(state, nextPin);
    if (!nextConnectionId) {
      return false;
    }

    return wireValueFromConnectionIdSelector(
      state,
      nextIcElementPath,
      nextConnectionId
    );
  } else {
    const outputs = elementOutputsFromCircuitElementIdSelector(state, [
      ...icElementPath,
      elementId,
    ]);
    if (!outputs) {
      return false;
    }
    return outputs[pinId] || false;
  }
};
