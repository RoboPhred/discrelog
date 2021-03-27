import { v4 as uuidV4 } from "uuid";
import pick from "lodash/pick";

import { circuitIdForWireIdSelector } from "../../selectors/wires";
import { CircuitGraphServiceState } from "../../state";
import { collectWireLineIds } from "./wire-lineids-collect";

export function wireMerge(
  state: CircuitGraphServiceState,
  targetWireId: string,
  subjectWireId: string
): CircuitGraphServiceState {
  const targetCircuitId = circuitIdForWireIdSelector.local(state, targetWireId);
  const subjectCircuitId = circuitIdForWireIdSelector.local(
    state,
    subjectWireId
  );
  if (!targetCircuitId || !subjectCircuitId) {
    throw new Error("Unable to determine circuit id for wire.");
  }

  if (targetCircuitId !== subjectCircuitId) {
    throw new Error("Unable to merge wires in different circuits.");
  }

  const targetWire = state.wiresByWireId[targetWireId];
  const subjectWire = state.wiresByWireId[subjectWireId];
  if (!targetWire || !subjectWire) {
    throw new Error("Wire not found.");
  }

  const [targetInputs, targetOutputs] = collectWireLineIds(state, targetWireId);
  const [subjectInputs, subjectOutputs] = collectWireLineIds(
    state,
    subjectWireId
  );

  if (
    targetOutputs.length + subjectOutputs.length <= 1 &&
    targetInputs.length <= 1 &&
    subjectInputs.length <= 1
  ) {
    // At most one output between them, and each has at most one input.  combine the lines.
    const sourceLineId = uuidV4();
    state = setWireLineIds(state, targetWireId, sourceLineId);
    state = setWireLineIds(state, subjectWireId, sourceLineId);
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

function setWireLineIds(
  state: CircuitGraphServiceState,
  wireId: string,
  lineId: string
): CircuitGraphServiceState {
  const wire = state.wiresByWireId[wireId];
  if (!wire) {
    return state;
  }

  const wireSegmentsById: typeof state.wireSegmentsById = {
    ...state.wireSegmentsById,
  };

  for (const segId of wire.wireSegmentIds) {
    const seg = state.wireSegmentsById[segId];
    if (seg.type === "input" || seg.type === "output") {
      wireSegmentsById[segId] = {
        ...seg,
        lineId,
      };
    }
  }

  return {
    ...state,
    wireSegmentsById,
  };
}
