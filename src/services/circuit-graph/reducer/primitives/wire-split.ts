import difference from "lodash/difference";
import mapValues from "lodash/mapValues";
import { v4 as uuidV4 } from "uuid";

import {
  circuitIdForWireIdSelector,
  wireIdFromWireJointIdSelector,
} from "../../selectors/wires";
import { CircuitGraphServiceState } from "../../state";
import { isInputWireSegment, isOutputWireSegment } from "../../types";
import { getJointIdsFromSegment, getSegmentIdsFromJoint } from "../../utils";
import { WireOperationError } from "../errors/WireOperationError";

import { wireCreate } from "./wire-create";

/**
 * Scans through a wire network given a joint id and moves all connected segments and joints to a new network.
 */
export function wireSplit(
  state: CircuitGraphServiceState,
  jointId: string
): CircuitGraphServiceState {
  const oldWireId = wireIdFromWireJointIdSelector.local(state, jointId);
  if (!oldWireId) {
    throw new WireOperationError("Wire id for joint not found.");
  }

  const circuitId = circuitIdForWireIdSelector.local(state, oldWireId);
  if (!circuitId) {
    throw new WireOperationError("Circuit id for joint not found.");
  }

  // Collect all connected segments and joints
  const { jointIds, segmentIds } = collectWireNetwork(
    state,
    oldWireId,
    jointId
  );

  // Strip values from existing wire network
  const oldWire = state.wiresByWireId[oldWireId];
  state = {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [oldWireId]: {
        ...oldWire,
        wireSegmentIds: difference(oldWire.wireSegmentIds, segmentIds),
        wireJointIds: difference(oldWire.wireJointIds, jointIds),
      },
    },
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
    wireSegmentsById: mapValues(
      state.wireSegmentsById,
      (segment, segmentId) => {
        if (segmentIds.indexOf(segmentId) === -1) {
          return segment;
        }

        if (!isOutputWireSegment(segment) && !isInputWireSegment(segment)) {
          return segment;
        }

        return {
          ...segment,
          lineId: mapLineId(segment.lineId),
        };
      }
    ),
  };

  // Create a new wire to store the values
  const newWireId = uuidV4();
  state = wireCreate(state, circuitId, newWireId, {
    wireJointIds: jointIds,
    wireSegmentIds: segmentIds,
  });

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
