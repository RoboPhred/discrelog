import * as React from "react";

export function useOutsideEvent(
  element: HTMLElement | null,
  onOutsideEvent: () => void
) {
  const onEvent = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!element) {
        return;
      }

      if (!element.contains(e.target as any)) {
        onOutsideEvent();
      }
    },
    [element, onOutsideEvent]
  );

  React.useEffect(() => {
    document.addEventListener("mousedown", onEvent);
    document.addEventListener("touchstart", onEvent);

    return () => {
      document.removeEventListener("mousedown", onEvent);
      document.removeEventListener("touchstart", onEvent);
    };
  }, [onEvent]);
}
