import { AppState } from "@/store";

import {
  nodeNameFromNodeIdSelector,
  nodeNameOrDefaultFromNodeIdSelector,
} from "@/services/node-graph/selectors/nodes";
import { createCircuitEditorUiSettingsSelector } from "../utils";

export const nodeNameModeSelector = createCircuitEditorUiSettingsSelector(
  (s) => s.nodeNameMode
);

export const nodeFieldDisplayNameFromNodeId = (
  state: AppState,
  nodeId: string
) => {
  const mode = state.services.circuitEditorUiSettings.nodeNameMode;
  switch (mode) {
    case "all":
    default:
      return nodeNameOrDefaultFromNodeIdSelector(state, nodeId);
    case "named-only":
      return nodeNameFromNodeIdSelector(state, nodeId);
    case "none":
      return null;
  }
};
