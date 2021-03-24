import pick from "lodash/pick";
import difference from "lodash/difference";
import mapValues from "lodash/mapValues";

import { CircuitGraphServiceState } from "../../state";

export default function wireDelete(
  state: CircuitGraphServiceState,
  removedWireId: string
): CircuitGraphServiceState {
  const wire = state.wiresByWireId[removedWireId];
  if (!wire) {
    return state;
  }

  const { wireSegmentIds, wireJointIds } = wire;

  return {
    ...state,
    wireIdsByCircuitId: mapValues(state.wireIdsByCircuitId, (wiresInCircuit) =>
      wiresInCircuit.filter((x) => x !== removedWireId)
    ),
    wireSegmentsById: pick(
      state.wireSegmentsById,
      difference(Object.keys(state.wireSegmentsById), wireSegmentIds)
    ),
    wiresByWireId: pick(
      state.wiresByWireId,
      Object.keys(state.wiresByWireId).filter((x) => x !== removedWireId)
    ),
    wireJointPositionsByJointId: pick(
      state.wireJointPositionsByJointId,
      difference(Object.keys(state.wireJointPositionsByJointId), wireJointIds)
    ),
  };
}
