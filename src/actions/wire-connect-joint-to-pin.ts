import { AnyAction } from "redux";

import { ElementPin } from "@/services/circuit-graph/types";

export const WIRE_CONNECT_JOINT_TO_PIN_ACTION = "@wire/connect/joint-to-pin" as const;
export const connectJointToPin = (
  wireId: string,
  jointId: string,
  pin: ElementPin
) => ({
  type: WIRE_CONNECT_JOINT_TO_PIN_ACTION,
  payload: {
    wireId,
    jointId,
    pin,
  },
});
export type WireConnectJointToPinAction = ReturnType<typeof connectJointToPin>;
export function isWireConnectJointToPinAction(
  action: AnyAction
): action is WireConnectJointToPinAction {
  return action.type === WIRE_CONNECT_JOINT_TO_PIN_ACTION;
}
