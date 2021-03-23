import { AnyAction } from "redux";

import { Point } from "@/geometry";

import { WireSegment } from "@/services/circuit-graph/types";

export const WIRE_HYDRATE_ACTION = "@wire/hydrate" as const;
export interface HydrateWireSettings {
  wireId: string;
  wireSegments: (WireSegment & { wireSegmentId: string })[];
  wireJoints: (Point & { jointId: string })[];
}
export const hydrateWire = (settings: HydrateWireSettings) => ({
  type: WIRE_HYDRATE_ACTION,
  payload: settings,
});
export type HydrateWireAction = ReturnType<typeof hydrateWire>;
export function isHydrateWireAction(
  action: AnyAction
): action is HydrateWireAction {
  return action.type === WIRE_HYDRATE_ACTION;
}
