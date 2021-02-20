import * as React from "react";
import { VirtualElement } from "@popperjs/core";

import { Point } from "@/geometry";

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
        isOpen={open}
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

export interface UseContextMenu {
  renderContextMenu(content: React.ReactNode): React.ReactNode;
  openContextMenu(e: React.MouseEvent): void;
}
export function useContextMenu(): UseContextMenu {
  const [ctxPos, setCtxPos] = React.useState<Point | null>(null);

  const openContextMenu = React.useCallback((e: React.MouseEvent) => {
    setCtxPos({ x: e.pageX, y: e.pageY });
  }, []);

  const onCloseContextMenu = React.useCallback(() => {
    setCtxPos(null);
  }, []);

  const renderContextMenu = React.useCallback(
    (content: JSX.Element) => {
      if (!ctxPos) {
        return null;
      }

      return (
        <ContextMenu
          open
          onRequestClose={onCloseContextMenu}
          x={ctxPos.x}
          y={ctxPos.y}
        >
          {content}
        </ContextMenu>
      );
    },
    [ctxPos, onCloseContextMenu]
  );

  return {
    openContextMenu,
    renderContextMenu,
  };
}
