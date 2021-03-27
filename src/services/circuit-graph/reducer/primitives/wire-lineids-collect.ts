import { CircuitGraphServiceState } from "../../state";

export function collectWireLineIds(
  state: CircuitGraphServiceState,
  wireId: string
): [inputLineIds: string[], outputLineIds: string[]] {
  const wire = state.wiresByWireId[wireId];
  if (!wire) {
    return [[], []];
  }

  const inputLineIds = new Set<string>();
  const outputLineIds = new Set<string>();
  for (const segId of wire.wireSegmentIds) {
    const seg = state.wireSegmentsById[segId];
    if (seg.type === "input") {
      inputLineIds.add(seg.lineId);
    } else if (seg.type === "output") {
      outputLineIds.add(seg.lineId);
    }
  }

  return [Array.from(inputLineIds), Array.from(outputLineIds)];
}
