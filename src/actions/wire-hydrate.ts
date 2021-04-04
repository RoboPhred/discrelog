import { AnyAction } from "redux";

import { Point } from "@/geometry";

import { WireSegment } from "@/services/circuit-graph/types";

export const ACTION_WIRE_HYDRATE = "@wire/hydrate" as const;
export interface HydrateWireSettings {
  wireId: string;
  circuitId: string;
  wireSegments: (WireSegment & { wireSegmentId: string })[];
  wireJoints: (Point & { jointId: string })[];
}
export const hydrateWire = (settings: HydrateWireSettings) => ({
  type: ACTION_WIRE_HYDRATE,
  payload: settings,
});
export type HydrateWireAction = ReturnType<typeof hydrateWire>;
export function isHydrateWireAction(
  action: AnyAction
): action is HydrateWireAction {
  return action.type === ACTION_WIRE_HYDRATE;
}
