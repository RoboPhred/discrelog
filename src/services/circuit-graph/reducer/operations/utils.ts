import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import difference from "lodash/difference";
import { v4 as uuidV4 } from "uuid";

import { CircuitGraphServiceState } from "../../state";
import {
  isInputWireSegment,
  isOutputWireSegment,
  WireSegment,
} from "../../types";
import { circuitIdForWireIdSelector } from "../../selectors/wires";
import { getJointIdsFromSegment, getSegmentIdsFromJoint } from "../../utils";

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

export function addSegment(
  state: CircuitGraphServiceState,
  wireId: string,
  segment: WireSegment,
  wireSegmentId = uuidV4()
): CircuitGraphServiceState {
  const wire = state.wiresByWireId[wireId];
  if (!wire) {
    return state;
  }

  return {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        ...wire,
        wireSegmentIds: [...wire.wireSegmentIds, wireSegmentId],
      },
    },
    wireSegmentsById: {
      ...state.wireSegmentsById,
      [wireSegmentId]: segment,
    },
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
    const joints = getJointIdsFromSegment(segment);
    for (const jointId of joints) {
      if (
        remainingSegmentIds.every(
          (remainingSegmentId) =>
            getJointIdsFromSegment(
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

export function wireMerge(
  state: CircuitGraphServiceState,
  targetWireId: string,
  subjectWireId: string
): CircuitGraphServiceState | null {
  const targetCircuitId = circuitIdForWireIdSelector.local(state, targetWireId);
  const subjectCircuitId = circuitIdForWireIdSelector.local(
    state,
    subjectWireId
  );
  if (
    !targetCircuitId ||
    !subjectCircuitId ||
    targetCircuitId !== subjectCircuitId
  ) {
    return null;
  }

  const targetWire = state.wiresByWireId[targetWireId];
  const subjectWire = state.wiresByWireId[subjectWireId];
  if (!targetWire || !subjectWire) {
    return null;
  }

  const remainingWireIds = Object.keys(state.wiresByWireId).filter(
    (x) => x !== subjectWireId
  );

  return {
    ...state,
    wireIdsByCircuitId: {
      ...state.wireIdsByCircuitId,
      [targetCircuitId]: state.wireIdsByCircuitId[targetCircuitId].filter(
        (x) => x !== subjectWireId
      ),
    },
    wiresByWireId: {
      ...pick(state.wiresByWireId, remainingWireIds),
      [targetWireId]: {
        ...targetWire,
        wireSegmentIds: [
          ...targetWire.wireSegmentIds,
          ...subjectWire.wireSegmentIds,
        ],
        wireJointIds: [...targetWire.wireJointIds, ...subjectWire.wireJointIds],
      },
    },
  };
}

/**
 * Scans through a wire network given a joint id and moves all connected segments and joints to a new network.
 */
export function wireSplit(
  state: CircuitGraphServiceState,
  wireId: string,
  jointId: string
): CircuitGraphServiceState | null {
  const circuitId = circuitIdForWireIdSelector.local(state, wireId);
  if (!circuitId) {
    return null;
  }

  const { jointIds, segmentIds } = collectWireNetwork(state, wireId, jointId);

  // Strip values from existing wire network
  state = {
    ...state,
    wiresByWireId: mapValues(state.wiresByWireId, (wire) => ({
      ...wire,
      wireSegmentIds: difference(wire.wireSegmentIds, segmentIds),
      wireJointIds: difference(wire.wireJointIds, jointIds),
    })),
  };

  // Change the line ids.
  // This is so in the future if the wire networks are joined, we won't get conflicting inputs.
  const lineIdMap: Record<string, string> = {};
  function mapLineId(lineId: string): string {
    if (!lineIdMap[lineId]) {
      lineIdMap[lineId] = uuidV4();
    }

    return lineIdMap[lineId];
  }
  state = {
    ...state,
    wireSegmentsById: mapValues(state.wireSegmentsById, (segment) => {
      if (!isOutputWireSegment(segment) && !isInputWireSegment(segment)) {
        return segment;
      }
      return {
        ...segment,
        lineId: mapLineId(segment.lineId),
      };
    }),
  };

  // Create a new wire to store the values
  const newWireId = uuidV4();
  state = {
    ...state,
    wireIdsByCircuitId: {
      ...state.wireIdsByCircuitId,
      [circuitId]: [...state.wireIdsByCircuitId[circuitId], newWireId],
    },
    wiresByWireId: {
      ...state.wiresByWireId,
      [newWireId]: {
        wireJointIds: jointIds,
        wireSegmentIds: segmentIds,
      },
    },
  };

  return state;
}

function collectWireNetwork(
  state: CircuitGraphServiceState,
  wireId: string,
  jointId: string
): { jointIds: string[]; segmentIds: string[] } {
  const jointIds = new Set<string>();
  const segmentIds = new Set<string>();

  function collectSegment(segmentId: string) {
    if (segmentIds.has(segmentId)) {
      return;
    }

    const segment = state.wireSegmentsById[segmentId];
    if (!segment) {
      return;
    }

    segmentIds.add(segmentId);
    const jointIds = getJointIdsFromSegment(segment);
    jointIds.forEach(collectJoint);
  }

  function collectJoint(jointId: string) {
    if (jointIds.has(jointId)) {
      return;
    }

    jointIds.add(jointId);
    const segmentIds = getSegmentIdsFromJoint(state, wireId, jointId);
    segmentIds.forEach(collectSegment);
  }

  collectJoint(jointId);

  return {
    jointIds: Array.from(jointIds),
    segmentIds: Array.from(segmentIds),
  };
}
