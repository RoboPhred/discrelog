import { AppState } from "@/store";

import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";

import { nodeTypeFromNodeIdSelector } from "./nodes";

export const nodeDefFromNodeIdSelector = (state: AppState, nodeId: string) => {
  const nodeType = nodeTypeFromNodeIdSelector(state, nodeId);
  if (!nodeType) {
    return null;
  }

  const def = nodeDefinitionFromTypeSelector(state, nodeType);

  return def;
};
