import flatMap from "lodash/flatMap";
import find from "lodash/find";

import { asArray, MaybeArray } from "@/arrays";
import { AppState } from "@/store";

import nodeDefinitionSources from "../definition-sources";
import { NodeDefinition, NodeDefinitionSource } from "../types";

/**
 * Gets an array of node definitions from the current state.
 * WARN: Returns an unstable reference, not react safe.
 */
// FIXME: Stabilize output for redux use.
export const nodeDefinitionsSelector = (state: AppState) => {
  return flatMap(nodeDefinitionSources, (source) =>
    resolveSources(source, state)
  );
};

// FIXME: Stabilize output for redux use.
export const nodeDefinitionsByTypeSelector = (state: AppState) => {
  const defsByType: Record<string, NodeDefinition> = {};
  const defs = nodeDefinitionsSelector(state);
  for (const def of defs) {
    defsByType[def.type] = def;
  }
  return defsByType;
};

// FIXME: Stabilize output for redux use.
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
