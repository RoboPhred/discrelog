import values from "lodash/values";
import flatMap from "lodash/flatMap";

import { AppState } from "@/store";

import { rootCircuitGraphSelector } from "./graph";
import { EvolverPin } from "../types";

const EmptyIdArray = Object.freeze([] as string[]);
const EmptyPinInputs = Object.freeze({} as Record<string, EvolverPin>);

/**
 * Gets an array of evolver ids connected to the outputs of the given element id.
 * WARN: Not react safe.  For reducer use only.
 */
export const outputEvolverIdsFromEvolverIdSelector = (
  state: AppState,
  evolverId: string
) => {
  const { evolversById } = rootCircuitGraphSelector(state);

  const evolver = evolversById[evolverId];
  if (!evolver) {
    return EmptyIdArray;
  }

  return flatMap(values(evolver.outputsByPin), (pins) =>
    pins.map((x) => x.evolverId)
  );
};

/**
 * Gets a map of element input pins to their output sources given an element id.
 */
export const inputPinsByPinIdFromEvolverIdSelector = (
  state: AppState,
  evolverId: string
) => {
  const { evolversById } = rootCircuitGraphSelector(state);
  const evolver = evolversById[evolverId];
  if (!evolver) {
    return EmptyPinInputs;
  }

  return evolver.inputsByPin;
};
