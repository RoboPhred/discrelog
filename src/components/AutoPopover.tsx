import * as React from "react";
import { Options } from "@popperjs/core";

import Popover from "./Popover";
import { MenuCloseContextProvider } from "./Menus/MenuCloseContext";

export interface AutoPopoverProps {
  content: JSX.Element;
  placement?: Options["placement"];
}

const AutoPopover: React.FC<AutoPopoverProps> = ({
  content,
  placement,
  children,
}) => {
  const anchorEl = React.useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = React.useState(false);
  const onClick = React.useCallback(() => {
    setOpen(true);
  }, []);
  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <MenuCloseContextProvider value={onClose}>
      <div ref={anchorEl} onClick={onClick}>
        {children}
      </div>
      <Popover
        anchorEl={anchorEl.current}
        isOpen={open}
        placement={placement}
        onRequestClose={onClose}
      >
        {open && content}
      </Popover>
    </MenuCloseContextProvider>
  );
};

export default AutoPopover;
