import { AppState } from "@/store";
import { EvolverDefinitionsByType } from "@/evolvers";

import { getEvolverIdFromElementIdPath } from "../utils";

import { rootElementGraphSelector } from "./graph";

export const evolverIdsByElementIdSelector = (state: AppState) =>
  rootElementGraphSelector(state).evolverIdsByElementId;

/**
 * Gets the simulator node id for a given circuit node id.
 */
export const evolverIdFromElementIdSelector = (
  state: AppState,
  elementIdPath: string[]
) => {
  const { evolverIdsByElementId } = rootElementGraphSelector(state);
  return getEvolverIdFromElementIdPath(evolverIdsByElementId, elementIdPath);
};

/**
 * Get all simulator node ids.
 *
 * WARN: Not react safe.
 */
export const evolverIdsSelector = (state: AppState) => {
  const { evolversById } = rootElementGraphSelector(state);
  return Object.keys(evolversById);
};

export const evolverTypeFromEvolverId = (
  state: AppState,
  evolverId: string
) => {
  const { evolversById } = rootElementGraphSelector(state);
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
