import pick from "lodash/pick";
import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { circuitIdToElementType } from "@/elements/definitions/integrated-circuits/utils";

import { createCircuitGraphReducer } from "../utils";

import elementDelete from "./operations/element-delete";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;
  const remainingCircuitIds = Object.keys(state.elementIdsByCircuitId).filter(
    (x) => x !== circuitId
  );

  const elementIdsForCircuit = state.elementIdsByCircuitId[circuitId] ?? [];

  const circuitElementType = circuitIdToElementType(circuitId);
  const elementIdsOfCircuit = Object.keys(state.elementsById).filter(
    (id) => state.elementsById[id].elementType === circuitElementType
  );

  const removedElementIds = [...elementIdsForCircuit, ...elementIdsOfCircuit];

  state = elementDelete(state, removedElementIds, rootState);

  return {
    ...state,
    elementIdsByCircuitId: pick(
      state.elementIdsByCircuitId,
      remainingCircuitIds
    ),
    wireIdsByCircuitId: pick(state.wireIdsByCircuitId, remainingCircuitIds),
  };
});
