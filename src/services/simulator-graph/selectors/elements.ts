import { AppState } from "@/store";
import { EvolverDefinitionsByType } from "@/evolvers";

import { getEvolverIdFromElementIdPath } from "../utils";

import { rootCircuitGraphSelector } from "./graph";
import { ElementPin } from "@/services/circuit-graph/types";
import { EvolverPin } from "../types";

export const evolverIdsByElementIdSelector = (state: AppState) =>
  rootCircuitGraphSelector(state).evolverIdsByElementId;

/**
 * Gets the evolver id for a given element id.
 */
export const evolverIdFromElementIdSelector = (
  state: AppState,
  elementIdPath: string[]
) => {
  const { evolverIdsByElementId } = rootCircuitGraphSelector(state);
  return getEvolverIdFromElementIdPath(evolverIdsByElementId, elementIdPath);
};

/**
 * Get all evolver ids.
 *
 * WARN: Not react safe.
 */
export const evolverIdsSelector = (state: AppState) => {
  const { evolversById } = rootCircuitGraphSelector(state);
  return Object.keys(evolversById);
};

export const evolverTypeFromEvolverId = (
  state: AppState,
  evolverId: string
) => {
  const { evolversById } = rootCircuitGraphSelector(state);
  const evolver = evolversById[evolverId];
  if (!evolver) {
    return null;
  }

  return evolver.evolverType;
};

export const evolverDefFromEvolverId = (state: AppState, evolverId: string) => {
  const type = evolverTypeFromEvolverId(state, evolverId);
  if (!type) {
    return null;
  }

  return EvolverDefinitionsByType[type] ?? null;
};
