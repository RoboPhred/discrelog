import { v4 as uuidV4 } from "uuid";

import { normalize, pointAdd, pointSubtract, scale } from "@/geometry";

import { AppState } from "@/store";

import {
  endPositionForWireSegmentId,
  startPositionForWireSegmentId,
} from "../../selectors/wire-positions";

import { CircuitGraphServiceState } from "../../state";
import { WireSegment } from "../../types";
import { wireIdFromWireSegmentIdSelector } from "../../selectors/wires";
import { wireJointInsert } from "./wire-joint-insert";
import { wireSegmentRemove } from "./wire-segment-remove";
import { wireSegmentInsert } from "./wire-segment-insert";
import { WireOperationError } from "../errors/WireOperationError";

export default function wireSegmentSplit(
  state: CircuitGraphServiceState,
  wireSegmentId: string,
  segmentSplitLength: number,
  splitJointId: string,
  rootState: AppState
): CircuitGraphServiceState {
  const wireId = wireIdFromWireSegmentIdSelector.local(state, wireSegmentId);
  if (!wireId) {
    throw new WireOperationError("Wire segment parent wire not found.");
  }

  const targetSegment = state.wireSegmentsById[wireSegmentId];
  if (!targetSegment) {
    throw new WireOperationError("Wire segment not found.");
  }

  const startPos = startPositionForWireSegmentId(rootState, wireSegmentId);
  const endPos = endPositionForWireSegmentId(rootState, wireSegmentId);
  const lineVector = normalize(pointSubtract(endPos, startPos));
  const segmentJointPos = pointAdd(
    startPos,
    scale(lineVector, segmentSplitLength)
  );

  state = wireJointInsert(state, wireId, splitJointId, segmentJointPos);

  const firstSegmentId = uuidV4();
  const secondSegmentId = uuidV4();
  let firstSegment: WireSegment;
  let secondSegment: WireSegment;
  switch (targetSegment.type) {
    case "bridge":
      {
        firstSegment = {
          type: "bridge",
          jointAId: targetSegment.jointAId,
          jointBId: splitJointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: splitJointId,
          jointBId: targetSegment.jointBId,
        };
      }
      break;
    case "input":
    case "output":
      {
        firstSegment = {
          ...targetSegment,
          jointId: splitJointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: splitJointId,
          jointBId: targetSegment.jointId,
        };
      }
      break;
    case "input-output":
      {
        const lineId = uuidV4();
        firstSegment = {
          type: "output",
          outputPin: targetSegment.outputPin,
          jointId: splitJointId,
          lineId,
        };
        secondSegment = {
          type: "input",
          inputPin: targetSegment.inputPin,
          jointId: splitJointId,
          lineId,
        };
      }
      break;
    default:
      throw new WireOperationError("Unknown segment type.");
  }

  // Remove the modified segment, it is to be replaced with the two new segments.
  state = wireSegmentRemove(state, wireSegmentId, {
    deleteWireIfLastSegment: false,
    removeOrphanJoints: false,
  });

  // Add the new segments.
  state = wireSegmentInsert(state, wireId, firstSegmentId, firstSegment);
  state = wireSegmentInsert(state, wireId, secondSegmentId, secondSegment);

  return state;
}
