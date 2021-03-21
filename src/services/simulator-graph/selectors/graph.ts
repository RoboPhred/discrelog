import { createSelector } from "reselect";

import { elementIdsByCircuitIdSelector } from "@/services/circuits/selectors/elements";
import { elementTypesByElementIdSelector } from "@/services/element-graph/selectors/elements";
import { connectionsByIdSelector } from "@/services/element-graph/selectors/connections";
import { elementDefinitionsByTypeSelector } from "@/services/element-types/selectors/element-types";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { produceCircuitGraph } from "../graph-production";
import { EmptySimulatorGraph } from "../types";

export const rootElementGraphSelector = createSelector(
  elementIdsByCircuitIdSelector,
  elementTypesByElementIdSelector,
  connectionsByIdSelector,
  elementDefinitionsByTypeSelector,
  (
    elementIdsByCircuitId,
    elementTypesByElementId,
    connectionsById,
    elementDefsByElementType
  ) => {
    // FIXME: Display this error to the user.
    try {
      return produceCircuitGraph(ROOT_CIRCUIT_ID, {
        elementIdsByCircuitId,
        elementTypesByElementId,
        connectionsById,
        elementDefsByElementType,
      });
    } catch (e) {
      console.error(e);
      return EmptySimulatorGraph;
    }
  }
);
