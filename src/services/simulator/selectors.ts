import { createSelector } from "reselect";

import { mapValues, mapKeys } from "lodash-es";

import { AppState } from "@/store";

import { NodeTypes } from "./node-types";

export const nodesById = (s: AppState) => s.services.simulator.nodesById;

export const nodeDefsById = createSelector(nodesById, nodesById =>
  mapValues(nodesById, x => NodeTypes[x.type])
);

export const nodeStateById = (s: AppState) =>
  s.services.simulator.nodeStatesByNodeId;
