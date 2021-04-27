import flatMap from "lodash/flatMap";
import find from "lodash/find";
import { createSelector } from "reselect";

import { asArray, MaybeArray } from "@/arrays";
import { AppState } from "@/store";

import elementDefinitionSources from "@/elements/definitions";

import {
  ElementDefinition,
  ElementDefinitionDerivedState,
  ElementDefinitionSource,
} from "@/elements/types";

const elementDefinitionsDerivedStateSelector = createSelector(
  (state: AppState) => state.services.circuitGraph,
  (state: AppState) => state.services.circuitLayout,
  (state: AppState) => state.services.circuitProperties,
  (circuitGraph, circuitLayout, circuitProperties) => ({
    circuitGraph,
    circuitLayout,
    circuitProperties,
  })
);

/**
 * Gets an array of element definitions from the current state.
 */
export const elementDefinitionsSelector = createSelector(
  elementDefinitionsDerivedStateSelector,
  (derivedState) => {
    const definitions = flatMap(elementDefinitionSources, (source) =>
      resolveSources(source, derivedState)
    );

    return definitions;
  }
);

export const elementDefinitionsByTypeSelector = createSelector(
  elementDefinitionsSelector,
  (defs) => {
    const defsByType: Record<string, ElementDefinition> = {};
    for (const def of defs) {
      defsByType[def.type] = def;
    }
    return defsByType;
  }
);

export const elementDefinitionFromTypeSelector = (
  state: AppState,
  elementType: string
) => {
  const definitions = elementDefinitionsSelector(state);
  return find(definitions, (x) => x.type === elementType) ?? null;
};

function resolveSources(
  source: ElementDefinitionSource,
  state: ElementDefinitionDerivedState
): ElementDefinition[] {
  let resolved: MaybeArray<ElementDefinition>;
  if (typeof source === "function") {
    resolved = source(state);
  } else {
    resolved = source;
  }

  return asArray(resolved);
}
