import find from "lodash/find";
import { NodePin, nodePinEquals } from "./types";
import { SimulatorState } from "./state";

export function isWired(
  state: SimulatorState,
  output: NodePin,
  input: NodePin
): boolean {
  return (
    find(
      state.connections,
      c =>
        nodePinEquals(output, c.outputPin) && nodePinEquals(input, c.inputPin)
    ) != null
  );
}
