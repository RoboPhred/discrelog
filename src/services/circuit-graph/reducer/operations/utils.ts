import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import difference from "lodash/difference";

import { CircuitGraphServiceState } from "../../state";
import { getSegmentJoints } from "../../utils";

export function removeJoint(
  state: CircuitGraphServiceState,
  wireId: string,
  jointId: string
): CircuitGraphServiceState {
  const wire = state.wiresByWireId[wireId];
  if (!wire) {
    return state;
  }

  if (wire.wireJointIds.indexOf(jointId) === -1) {
    return state;
  }

  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...wire,
      wireJointIds: [...wire.wireJointIds.filter((x) => x !== jointId)],
    },
  };

  const wireJointPositionsByJointId = pick(
    state.wireJointPositionsByJointId,
    Object.keys(state.wireJointPositionsByJointId).filter((x) => x !== jointId)
  );

  return {
    ...state,
    wiresByWireId,
    wireJointPositionsByJointId,
  };
}

export function removeSegment(
  state: CircuitGraphServiceState,
  wireId: string,
  wireSegmentId: string,
  removeOrphanJoints = true
): CircuitGraphServiceState {
  const wire = state.wiresByWireId[wireId];
  if (!wire) {
    return state;
  }

  const segment = state.wireSegmentsById[wireSegmentId];
  if (!segment) {
    return state;
  }

  const remainingSegmentIds = wire.wireSegmentIds.filter(
    (x) => x !== wireSegmentId
  );

  if (remainingSegmentIds.length === 0) {
    return removeWire(state, wireId);
  }

  if (removeOrphanJoints) {
    const joints = getSegmentJoints(segment);
    for (const jointId of joints) {
      if (
        remainingSegmentIds.every(
          (remainingSegmentId) =>
            getSegmentJoints(
              state.wireSegmentsById[remainingSegmentId]
            ).indexOf(jointId) === -1
        )
      ) {
        // No other segment uses this joint.
        state = removeJoint(state, wireId, jointId);
      }
    }
  }

  return {
    ...state,
    wireSegmentsById: pick(
      state.wireSegmentsById,
      Object.keys(state.wireSegmentsById).filter((x) => x !== wireSegmentId)
    ),
    wiresByWireId: mapValues(state.wiresByWireId, (wire) => ({
      ...wire,
      wireSegmentIds: wire.wireSegmentIds.filter((x) => x !== wireSegmentId),
    })),
  };
}

export function removeWire(
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
