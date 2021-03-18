import * as React from "react";

export function useQuerySelector(selector: string): Element | null {
  const [element, setElement] = React.useState<Element | null>(null);
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setElement(document.querySelector(selector));
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setElement(document.querySelector(selector));

    return () => {
      observer.disconnect();
    };
  }, [selector]);

  return element;
}
