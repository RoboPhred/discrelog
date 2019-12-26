import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByIdSelector } from "@/services/graph/selectors/nodes";

import { createSelectionSelector } from "../utils";

export const selectedNodeIdsSelector = createSelectionSelector(
  state => state.selectedNodeIds
);

export const selectedNodesByIdSelector = createSelector(
  nodesByIdSelector,
  selectedNodeIdsSelector,
  (nodesById, selectedNodeIds) => pick(nodesById, selectedNodeIds)
);
