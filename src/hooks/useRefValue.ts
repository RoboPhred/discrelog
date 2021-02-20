import * as React from "react";

export function useRefValue<T>(value: T): React.RefObject<T> {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  });

  return ref;
}
