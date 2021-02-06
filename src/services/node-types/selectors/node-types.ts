import flatMap from "lodash/flatMap";
import find from "lodash/find";

import { asArray, MaybeArray } from "@/arrays";
import { AppState } from "@/store";

import nodeDefinitionSources from "../definition-sources";
import { NodeDefinition, NodeDefinitionSource } from "../types";
import { createSelector } from "reselect";

/**
 * Gets an array of node definitions from the current state.
 * WARN: Returns an unstable reference, not react safe.
 */
let cachedNodeDefinitionsSelector: NodeDefinition[] = [];
export const nodeDefinitionsSelector = (state: AppState) => {
  const nodeDefinitions = flatMap(nodeDefinitionSources, (source) =>
    resolveSources(source, state)
  );

  if (
    nodeDefinitions.every(
      (def, index) => def === cachedNodeDefinitionsSelector[index]
    )
  ) {
    return cachedNodeDefinitionsSelector;
  }

  cachedNodeDefinitionsSelector = nodeDefinitions;
  return nodeDefinitions;
};

export const nodeDefinitionsByTypeSelector = createSelector(
  nodeDefinitionsSelector,
  (defs) => {
    const defsByType: Record<string, NodeDefinition> = {};
    for (const def of defs) {
      defsByType[def.type] = def;
    }
    return defsByType;
  }
);

export const nodeDefinitionFromTypeSelector = (
  state: AppState,
  nodeType: string
) => {
  const definitions = nodeDefinitionsSelector(state);
  return find(definitions, (x) => x.type === nodeType) ?? null;
};

function resolveSources(
  source: NodeDefinitionSource,
  state: AppState
): NodeDefinition[] {
  let resolved: MaybeArray<NodeDefinition>;
  if (typeof source === "function") {
    resolved = source(state);
  } else {
    resolved = source;
  }

  return asArray(resolved);
}
