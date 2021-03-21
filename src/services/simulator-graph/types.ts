import { EvolverType } from "@/evolvers";
import { ElementDefinition } from "@/elements/types";

import { Connection } from "../element-graph/types";

export interface EvolverPin {
  evolverId: string;
  pinId: string;
}

export interface SimulatorEvolver {
  /**
   * The type of this evolver.
   */
  evolverType: EvolverType;

  /**
   * Input source pins by input pin id.
   *
   * This is redundant with the opposing evolver's outputsByPin,
   * to increase lookup speed.
   */
  inputsByPin: Record<string, EvolverPin>;

  /**
   * Output source pins by output pin id.
   *
   * This is redundant with the opposing evolver's inputsByPin,
   * to increase lookup speed.
   */
  outputsByPin: Record<string, EvolverPin[]>;
}

export interface EvolverIdMappingTreeItem {
  evolverId: string | null;
  subElementIds: EvolverIdToElementIdMap;
}

export type EvolverIdToElementIdMap = Record<string, EvolverIdMappingTreeItem>;

export interface SimulatorGraphDependencies {
  elementIdsByCircuitId: Record<string, string[]>;
  elementTypesByElementId: Record<string, string>;
  connectionsById: Record<string, Connection>;
  elementDefsByElementType: Record<string, ElementDefinition>;
}

export interface SimulatorGraph {
  /**
   * A map of all evolvers by their id.
   */
  evolversById: Record<string, SimulatorEvolver>;

  /**
   * A map of evolver ids by the element id that generated them.
   */
  evolverIdsByElementId: EvolverIdToElementIdMap;
}

export const EmptySimulatorGraph: SimulatorGraph = Object.freeze({
  evolversById: {},
  evolverIdsByElementId: {},
});
