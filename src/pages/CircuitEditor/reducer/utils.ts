import union from "lodash/union";
import difference from "lodash/difference";

import { SelectionMode } from "../types";

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
