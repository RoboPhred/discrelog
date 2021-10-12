import * as React from "react";

function noop() {
  /* Do nothing */
}

const MenuCloseContext = React.createContext<() => void>(noop);

export function useMenuCloseContext() {
  return React.useContext(MenuCloseContext);
}

export interface MenuCloseListenerProps {
  onClose?(): void;
  children?: React.ReactNode;
}
export const MenuCloseListener = ({
  onClose: onCloseProp,
  children,
}: MenuCloseListenerProps) => {
  const onCloseChain = useMenuCloseContext();
  const onClose = React.useCallback(() => {
    if (onCloseProp) onCloseProp();
    if (onCloseChain) onCloseChain();
  }, [onCloseProp, onCloseChain]);

  return (
    <MenuCloseContext.Provider value={onClose}>
      {children}
    </MenuCloseContext.Provider>
  );
};
