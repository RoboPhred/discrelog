import * as React from "react";

import { asArray, MaybeArray } from "@/arrays";
import { isTruthy } from "@/utils";

export function useOutsidePointerEvent(
  element: MaybeArray<HTMLElement | null>,
  onOutsideEvent: () => void,
  when = true
) {
  const onEvent = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      const elements = asArray(element).filter(isTruthy);
      if (!elements.length) {
        return;
      }

      if (elements.every((element) => !element.contains(e.target as any))) {
        onOutsideEvent();
      }
    },
    [element, onOutsideEvent]
  );

  React.useEffect(() => {
    if (!when) {
      return;
    }

    document.addEventListener("pointerdown", onEvent);

    return () => {
      document.removeEventListener("pointerdown", onEvent);
    };
  }, [onEvent, when]);
}
