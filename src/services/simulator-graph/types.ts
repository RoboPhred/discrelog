import { ElementType } from "@/elements";

export interface SimulatorNodePin {
  simulatorNodeId: string;
  pinId: string;
}

export interface SimulatorNode {
  /**
   * The element type of this node.
   */
  elementType: ElementType;

  /**
   * Input source pins by input pin id.
   *
   * This is redundant with the opposing node's outputsByPin,
   * to increase lookup speed.
   */
  inputsByPin: Record<string, SimulatorNodePin>;

  /**
   * Output source pins by output pin id.
   *
   * This is redundant with the opposing node's inputsByPin,
   * to increase lookup speed.
   */
  outputsByPin: Record<string, SimulatorNodePin>;
}
