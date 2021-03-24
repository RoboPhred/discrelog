import mapValues from "lodash/mapValues";
import difference from "lodash/difference";
import { v4 as uuidV4 } from "uuid";

import { CircuitGraphServiceState } from "../../state";
import { getSegmentJoints } from "../../utils";
import { isInputWireSegment, isOutputWireSegment } from "../../types";
import { circuitIdForWireIdSelector } from "../../selectors/wires";

export default function wireSplit(
  state: CircuitGraphServiceState,
  wireId: string,
  jointId: string
): CircuitGraphServiceState {
  const circuitId = circuitIdForWireIdSelector.local(state, wireId);
  if (!circuitId) {
    return state;
  }

  const { jointIds, segmentIds } = collectWireNetwork(state, jointId);

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
    const jointIds = getSegmentJoints(segment);
    jointIds.forEach(collectJoint);
  }

  function collectJoint(jointId: string) {
    if (jointIds.has(jointId)) {
      return;
    }

    jointIds.add(jointId);
    const segmentIds = getJointSegments(state, jointId);
    segmentIds.forEach(collectSegment);
  }

  collectJoint(jointId);

  return {
    jointIds: Array.from(jointIds),
    segmentIds: Array.from(segmentIds),
  };
}

function getJointSegments(
  state: CircuitGraphServiceState,
  jointId: string
): string[] {
  const jointSegmentIds: string[] = [];

  const segmentIds = Object.keys(state.wireSegmentsById);
  for (const segmentId of segmentIds) {
    const segment = state.wireSegmentsById[segmentId];
    if (getSegmentJoints(segment).indexOf(jointId) !== -1) {
      jointSegmentIds.push(segmentId);
    }
  }

  return jointSegmentIds;
}
