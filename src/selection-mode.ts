import union from "lodash/union";
import difference from "lodash/difference";

import { ModifierKeys } from "./modifier-keys";

export type SelectionMode =
  | "set"
  | "append"
  | "remove"
  | "toggle"
  | "set-if-unselected";

export function getSelectMode(
  modifiers: ModifierKeys,
  defaultMode: SelectionMode = "set"
): SelectionMode {
  if (modifiers.shiftKey && modifiers.ctrlMetaKey) {
    return "remove";
  }
  if (modifiers.shiftKey) {
    return "append";
  }
  if (modifiers.ctrlMetaKey) {
    return "toggle";
  }
  return defaultMode;
}

export function combineSelection(
  selectedIds: string[],
  chosenIds: string[],
  mode: SelectionMode
) {
  switch (mode) {
    case "set":
      return chosenIds;
    case "set-if-unselected": {
      if (chosenIds.every((chosen) => selectedIds.indexOf(chosen) !== -1)) {
        // All were selected.
        return selectedIds;
      }

      // One wasn't selected, set it
      return chosenIds;
    }
    case "append":
      return union(selectedIds, chosenIds);
    case "remove":
      return difference(selectedIds, chosenIds);
    case "toggle": {
      return difference(selectedIds, chosenIds).concat(
        difference(chosenIds, selectedIds)
      );
    }
  }

  return chosenIds;
}
