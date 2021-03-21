import values from "lodash/values";
import flatMap from "lodash/flatMap";

import { AppState } from "@/store";

import { rootElementGraphSelector } from "./graph";
import { EvolverPin } from "../types";

const EmptyPinArray = Object.freeze([] as string[]);
const EmptyPinInputs = Object.freeze({} as Record<string, EvolverPin>);

/**
 * Gets an array of simulator node ids connected to the outputs of the given node id.
 * WARN: Not react safe.  For reducer use only.
 */
export const outputEvolverIdsFromEvolverIdSelector = (
  state: AppState,
  evolverId: string
) => {
  const { evolversById } = rootElementGraphSelector(state);

  const evolver = evolversById[evolverId];
  if (!evolver) {
    return EmptyPinArray;
  }

  return flatMap(values(evolver.outputsByPin), (pins) =>
    pins.map((x) => x.evolverId)
  );
};

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const inputPinsByPinIdFromEvolverIdSelector = (
  state: AppState,
  evolverId: string
) => {
  const { evolversById } = rootElementGraphSelector(state);
  const evolver = evolversById[evolverId];
  if (!evolver) {
    return EmptyPinInputs;
  }

  return evolver.inputsByPin;
};
