import { AnyAction } from "redux";

import pick from "lodash/pick";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { circuitIdToElementType } from "@/elements/definitions/integrated-circuits/utils";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";
import { deleteElement } from "@/actions/element-delete";

import { elementIdsFromTypeSelector } from "@/services/element-graph/selectors/elements";

export default (state: AppState = defaultAppState, action: AnyAction) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  const elementIdsInCircuit =
    state.services.circuits.elementIdsByCircuitId[circuitId];
  if (!elementIdsInCircuit) {
    return state;
  }

  // The node ids of instances of this circuit.
  const circuitTypeElementIds = elementIdsFromTypeSelector(
    state,
    circuitIdToElementType(circuitId)
  );

  const elementIdsToDelete = [...circuitTypeElementIds, ...elementIdsInCircuit];

  // We used to handle this in a seperate reducer in element-graph, but we need to
  // know the node types before deletion to know which instances of the circuit to delete,
  // and element-graph needs to know what elements are in each circuit.  This means
  // both need the data from the other, and they cannot be ordered separately.
  // This might be a sign that we need to move elementIdsByCircuitId into element-graph,
  // but this way seems cleaner as it keeps the separation of concerns while
  // leveraging actions to reuse the node deletion code.
  state = elementIdsToDelete.reduce(
    (state, elementId) => rootReducer(state, deleteElement(elementId)),
    state
  );

  const remainingCircuitIds = Object.keys(
    state.services.circuits.elementIdsByCircuitId
  ).filter((x) => x !== circuitId);

  return fpSet(state, "services", "circuits", (serviceState) => ({
    ...serviceState,
    elementIdsByCircuitId: pick(
      serviceState.elementIdsByCircuitId,
      remainingCircuitIds
    ),
    circuitNamesByCircuitId: pick(
      serviceState.circuitNamesByCircuitId,
      remainingCircuitIds
    ),
  }));
};
