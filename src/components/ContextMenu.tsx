import { VirtualElement } from "@popperjs/core";
import * as React from "react";
import { MenuCloseContextProvider } from "./Menus/MenuCloseContext";
import Popover from "./Popover";

export interface ContextMenuProps {
  x: number;
  y: number;
  open: boolean;
  onRequestClose(): void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  open,
  onRequestClose,
  children,
}) => {
  const anchorEl = React.useMemo<VirtualElement>(
    () => ({
      getBoundingClientRect: () => ({
        left: x,
        top: y,
        right: x,
        bottom: y,
        width: 0,
        height: 0,
        x,
        y,
      }),
    }),
    [x, y]
  );

  return (
    <MenuCloseContextProvider value={onRequestClose}>
      <Popover
        open={open}
        onRequestClose={onRequestClose}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        {children}
      </Popover>
    </MenuCloseContextProvider>
  );
};

export default ContextMenu;
