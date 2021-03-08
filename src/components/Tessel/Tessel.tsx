import * as React from "react";
import get from "lodash/get";

import { cls, fpSetByArray } from "@/utils";

import {
  TesselDropPosition,
  TesselItem,
  TesselValue,
  TesselWindowRenderer,
} from "./types";

import TesselFrame from "./TesselFrame";
import TesselDropCapture from "./TesselDropCapture";

import styles from "./Tessel.module.css";

import { TesselInteractionProvider } from "./TesselContext";
import { pruneEmptyTesselValues } from "./utils";

export interface TesselProps {
  className?: string;
  rootItem: TesselValue | null;
  renderWindow: TesselWindowRenderer;
  onLayoutChange(rootItem: TesselValue): void;
}

const Tessel: React.FC<TesselProps> = ({
  className,
  rootItem,
  renderWindow,
  onLayoutChange,
}) => {
  const moveWindow = React.useCallback(
    (from: string[], to: string[], position: TesselDropPosition) => {
      if (from.length === 0) {
        // If we have a window at the root, there is no place to drag it to.
        return;
      }

      let newRoot = rootItem;
      const movingElement = get(newRoot, from);
      // If rootItem is a string (implicit window), than there is no way we can find our
      // from target inside of it (given that from is not the root).
      // This would be covered by movingElement being undefined, but we add
      // the extra check to inform typescript of this condition.
      if (!newRoot || typeof newRoot === "string" || !movingElement) {
        return;
      }

      // Target must exist, or be the root.
      if (to.length > 0 && !get(newRoot, to)) {
        return;
      }

      // First, null out the from path.
      // We cannot clean up the stack at this point as that might remove path
      // elements that we are moving to.  Cleanup will be done later.
      newRoot = fpSetByArray(newRoot, from, null);

      // Now, insert the window at the new location
      newRoot = fpSetByArray(newRoot, to, (item: TesselValue) => {
        let newItem: TesselItem;
        if (position === "left" || position === "right") {
          newItem = {
            direction: "row",
            division: 50,
            first: position === "left" ? movingElement : item,
            second: position === "right" ? movingElement : item,
          };
        } else if (position === "top" || position === "bottom") {
          newItem = {
            direction: "column",
            division: 50,
            first: position === "top" ? movingElement : item,
            second: position === "bottom" ? movingElement : item,
          };
        } else {
          // Unknown position
          throw new Error(`Unknown tessel position: ${position}`);
        }
        return newItem;
      });

      // Remove the empty entry from the removal of the from element.
      newRoot = pruneEmptyTesselValues(newRoot);

      onLayoutChange(newRoot);
    },
    [rootItem, onLayoutChange]
  );

  return (
    <div className={cls("tessel", styles["tessel"], className)}>
      <TesselInteractionProvider moveWindow={moveWindow}>
        <TesselDropCapture>
          <div className={styles["tessel-content"]}>
            {rootItem && (
              <TesselFrame
                value={rootItem}
                renderWindow={renderWindow}
                onLayoutChange={onLayoutChange}
              />
            )}
          </div>
        </TesselDropCapture>
      </TesselInteractionProvider>
    </div>
  );
};

export default Tessel;
