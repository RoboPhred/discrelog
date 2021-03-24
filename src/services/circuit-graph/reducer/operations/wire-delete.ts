import { CircuitGraphServiceState } from "../../state";

import { removeWire } from "./utils";

export default function wireDelete(
  state: CircuitGraphServiceState,
  wireId: string
): CircuitGraphServiceState {
  return removeWire(state, wireId);
}
