import { createSelector } from "reselect";

import { elementIdsByCircuitIdSelector } from "@/services/circuit-graph/selectors/elements";
import { elementTypesByElementIdSelector } from "@/services/circuit-graph/selectors/elements";
import { connectionsByIdSelector } from "@/services/circuit-graph/selectors/connections";
import { elementDefinitionsByTypeSelector } from "@/services/element-types/selectors/element-types";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { produceCircuitGraph } from "../graph-production";
import { EmptySimulatorGraph } from "../types";

export const rootCircuitGraphSelector = createSelector(
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
    try {
      return produceCircuitGraph(ROOT_CIRCUIT_ID, {
        elementIdsByCircuitId,
        elementTypesByElementId,
        connectionsById,
        elementDefsByElementType,
      });
    } catch (e) {
      // FIXME: Display this error to the user.
      console.error(e);
      return EmptySimulatorGraph;
    }
  }
);
