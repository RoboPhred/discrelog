import { v4 as uuidV4 } from "uuid";
import pick from "lodash/pick";

import { normalize, pointAdd, pointSubtract, scale } from "@/geometry";

import { AppState } from "@/store";

import {
  endPositionByWireSegmentId,
  startPositionByWireSegmentId,
} from "../../selectors/wire-positions";

import { CircuitGraphServiceState } from "../../state";
import { WireSegment } from "../../types";

export default function wireSegmentSplit(
  state: CircuitGraphServiceState,
  wireId: string,
  wireSegmentId: string,
  segmentSplitLength: number,
  rootState: AppState
): [CircuitGraphServiceState, string | null] {
  const targetWire = state.wiresByWireId[wireId];
  if (!targetWire) {
    return [state, null];
  }

  const targetSegment = state.wireSegmentsById[wireSegmentId];
  if (!targetSegment) {
    return [state, null];
  }

  const startPos = startPositionByWireSegmentId(rootState, wireSegmentId);
  const endPos = endPositionByWireSegmentId(rootState, wireSegmentId);
  const lineVector = normalize(pointSubtract(endPos, startPos));
  const segmentJointPos = pointAdd(
    startPos,
    scale(lineVector, segmentSplitLength)
  );

  const segmentJointId = uuidV4();

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
          jointBId: segmentJointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: segmentJointId,
          jointBId: targetSegment.jointBId,
        };
      }
      break;
    case "input":
    case "output":
      {
        firstSegment = {
          ...targetSegment,
          jointId: segmentJointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: segmentJointId,
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
          jointId: segmentJointId,
          lineId,
        };
        secondSegment = {
          type: "input",
          inputPin: targetSegment.inputPin,
          jointId: segmentJointId,
          lineId,
        };
      }
      break;
    default:
      return [state, null];
  }

  // Remove the modified segment, it is to be replaced with the two new segments.
  const wireSegmentsById: typeof state.wireSegmentsById = pick(
    state.wireSegmentsById,
    Object.keys(state.wireSegmentsById).filter((id) => id !== wireSegmentId)
  );
  wireSegmentsById[firstSegmentId] = firstSegment;
  wireSegmentsById[secondSegmentId] = secondSegment;

  const wireJointPositionsByJointId: typeof state.wireJointPositionsByJointId = {
    ...state.wireJointPositionsByJointId,
    [segmentJointId]: segmentJointPos,
  };

  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...targetWire,
      wireSegmentIds: [
        ...targetWire.wireSegmentIds.filter((x) => x !== wireSegmentId),
        firstSegmentId,
        secondSegmentId,
      ],
      wireJointIds: [...targetWire.wireJointIds, segmentJointId],
    },
  };

  state = {
    ...state,
    wiresByWireId,
    wireSegmentsById,
    wireJointPositionsByJointId,
  };

  return [state, segmentJointId];
}
