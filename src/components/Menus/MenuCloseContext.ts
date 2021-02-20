import * as React from "react";

function noop() {
  /* Do nothing */
}

const MenuCloseContext = React.createContext<() => void>(noop);

export function useMenuCloseContext() {
  return React.useContext(MenuCloseContext);
}

export const MenuCloseContextProvider = MenuCloseContext.Provider;
