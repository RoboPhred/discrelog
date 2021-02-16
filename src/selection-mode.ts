import union from "lodash/union";
import difference from "lodash/difference";

import { ModifierKeys } from "./modifier-keys";

export type SelectionMode = "set" | "append" | "remove" | "toggle";

export function getSelectMode(modifiers: ModifierKeys): SelectionMode {
  if (modifiers.shiftKey && modifiers.ctrlMetaKey) {
    return "remove";
  }
  if (modifiers.shiftKey) {
    return "append";
  }
  if (modifiers.ctrlMetaKey) {
    return "toggle";
  }
  return "set";
}

export function combineSelection(
  selectedIds: string[],
  chosenIds: string[],
  mode: SelectionMode
) {
  switch (mode) {
    case "set":
      return chosenIds;
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
