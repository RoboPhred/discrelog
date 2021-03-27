import mapValues from "lodash/mapValues";
import pick from "lodash/pick";
import difference from "lodash/difference";

import { CircuitGraphServiceState } from "../../state";

export function wireRemove(
  state: CircuitGraphServiceState,
  wireId: string
): CircuitGraphServiceState {
  const wire = state.wiresByWireId[wireId];
  if (!wire) {
    return state;
  }

  const { wireSegmentIds, wireJointIds } = wire;

  return {
    ...state,
    wireIdsByCircuitId: mapValues(state.wireIdsByCircuitId, (wiresInCircuit) =>
      wiresInCircuit.filter((x) => x !== wireId)
    ),
    wireSegmentsById: pick(
      state.wireSegmentsById,
      difference(Object.keys(state.wireSegmentsById), wireSegmentIds)
    ),
    wiresByWireId: pick(
      state.wiresByWireId,
      Object.keys(state.wiresByWireId).filter((x) => x !== wireId)
    ),
    wireJointPositionsByJointId: pick(
      state.wireJointPositionsByJointId,
      difference(Object.keys(state.wireJointPositionsByJointId), wireJointIds)
    ),
  };
}
