import * as React from "react";
import { createPortal } from "react-dom";

import { Options, VirtualElement } from "@popperjs/core";
import { usePopper } from "react-popper";
import { useOutsideEvent } from "@/hooks/useOutsideEvent";

export interface PopoverProps {
  anchorEl: Element | VirtualElement | null;
  placement?: Options["placement"];
  isOpen: boolean;
  onRequestClose(): void;
}

const Popover: React.FC<PopoverProps> = ({
  isOpen,
  anchorEl,
  placement = "auto",
  onRequestClose,
  children,
}) => {
  const [popoverRef, setPopoverRef] = React.useState<HTMLDivElement | null>(
    null
  );
  const { attributes, styles } = usePopper(
    isOpen ? anchorEl : null,
    popoverRef,
    {
      placement,
    }
  );

  // Originally used FocusOn here, but that consumes the click.
  //  We want outside clicks to still function.
  useOutsideEvent(popoverRef, onRequestClose);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div ref={setPopoverRef} style={styles.popper} {...attributes.popper}>
      {children}
    </div>,
    document.body
  );
};

export default Popover;
