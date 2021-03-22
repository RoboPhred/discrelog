import { AppState } from "@/store";

import {
  elementNameFromElementIdSelector,
  elementNameOrDefaultFromElementIdSelector,
} from "@/services/circuit-graph/selectors/elements";
import { createUiSettingsSelector } from "../utils";

export const elementNameModeSelector = createUiSettingsSelector(
  (s) => s.elementNameMode
);

export const elementFieldDisplayNameFromElementId = (
  state: AppState,
  elementId: string
) => {
  const mode = state.services.uiSettings.elementNameMode;
  switch (mode) {
    case "all":
    default:
      return elementNameOrDefaultFromElementIdSelector(state, elementId);
    case "named-only":
      return elementNameFromElementIdSelector(state, elementId);
    case "none":
      return null;
  }
};
