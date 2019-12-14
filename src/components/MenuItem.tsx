import * as React from "react";

import PopupMenu from "./PopupMenu";
import { PopperPlacement } from "./Popper";

export interface MenuItemProps {
  title: string;
  className?: string;
  childPlacement?: PopperPlacement;
  onClick?(e: React.MouseEvent): void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  className,
  childPlacement = "right-end",
  onClick,
  children
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const isParentItem = React.Children.count(children) > 0;

  const onItemClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (isParentItem) {
        setOpen(!isOpen);
        e.preventDefault();
      }
      if (onClick) {
        onClick(e);
      }
    },
    [isOpen, isParentItem, onClick]
  );

  const renderResult = [];

  const item = (
    <div className={className} ref={ref} onClick={onItemClick}>
      {title}
    </div>
  );

  let popup: React.ReactNode = null;
  if (isParentItem) {
    popup = (
      <PopupMenu
        isOpen={isOpen}
        anchorEl={ref.current}
        placement={childPlacement}
      >
        {children}
      </PopupMenu>
    );
  }

  return (
    <>
      {item}
      {popup}
    </>
  );
};

export default MenuItem;
