import { AppState } from "@/store";

import { elementDefinitionFromTypeSelector } from "@/services/element-types/selectors/element-types";

import { elementTypeFromElementIdSelector } from "./elements";

export const elementDefinitionFromElementIdSelector = (
  state: AppState,
  elementId: string
) => {
  const elementType = elementTypeFromElementIdSelector(state, elementId);
  if (!elementType) {
    return null;
  }

  const def = elementDefinitionFromTypeSelector(state, elementType);

  return def;
};
