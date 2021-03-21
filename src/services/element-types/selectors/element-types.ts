import flatMap from "lodash/flatMap";
import find from "lodash/find";
import { createSelector } from "reselect";

import { asArray, MaybeArray } from "@/arrays";
import { AppState } from "@/store";

import elementDefinitionSources from "@/elements/definitions";

import { ElementDefinition, ElementDefinitionSource } from "@/elements/types";

/**
 * Gets an array of node definitions from the current state.
 * WARN: Returns an unstable reference, not react safe.
 */
let cachedDefinitionsSelector: ElementDefinition[] = [];
export const elementDefinitionsSelector = (state: AppState) => {
  const definitions = flatMap(elementDefinitionSources, (source) =>
    resolveSources(source, state)
  );

  if (
    definitions.every((def, index) => def === cachedDefinitionsSelector[index])
  ) {
    return cachedDefinitionsSelector;
  }

  cachedDefinitionsSelector = definitions;
  return definitions;
};

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
  state: AppState
): ElementDefinition[] {
  let resolved: MaybeArray<ElementDefinition>;
  if (typeof source === "function") {
    resolved = source(state);
  } else {
    resolved = source;
  }

  return asArray(resolved);
}
