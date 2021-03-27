import { CircuitGraphServiceState } from "../../state";
import { Wire } from "../../types";

export function wireCreate(
  state: CircuitGraphServiceState,
  circuitId: string,
  wireId: string,
  wire?: Wire
): CircuitGraphServiceState {
  return {
    ...state,
    wireIdsByCircuitId: {
      ...state.wireIdsByCircuitId,
      [circuitId]: [...state.wireIdsByCircuitId[circuitId], wireId],
    },
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: wire ?? {
        wireSegmentIds: [],
        wireJointIds: [],
      },
    },
  };
}
