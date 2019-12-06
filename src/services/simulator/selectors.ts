import mapValues from "lodash/mapValues";

import { AppState } from "@/store";

import { NodeTypes } from "./node-types";

export const nodesById = (s: AppState) => s.services.simulator.nodesById;

export const nodeTypesById = (s: AppState) =>
  mapValues(nodesById(s), n => n.type);

export const nodeDefsById = (s: AppState) =>
  mapValues(nodeTypesById(s), type => NodeTypes[type] || null);

export const nodeStatesById = (s: AppState) =>
  s.services.simulator.nodeStatesByNodeId;
