import { AppState } from "@/store";

import { elementDefinitionFromTypeSelector } from "@/services/element-types/selectors/element-types";

export const elementDefinitionFromElementIdSelector = (
  state: AppState,
  elementId: string
) => {
  // Not using the selector here to avoid circular dependencies in imports.
  const elementType =
    state.services.circuitGraph.elementsById[elementId]?.elementType;
  if (!elementType) {
    return null;
  }

  const def = elementDefinitionFromTypeSelector(state, elementType);

  return def;
};
