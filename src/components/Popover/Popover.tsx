import * as React from "react";
import { createPortal } from "react-dom";

import { Options, VirtualElement } from "@popperjs/core";
import { usePopper } from "react-popper";

import { useOutsideMouseEvent } from "@/hooks/useOutsideMouseEvent";
import { useArrayState } from "@/hooks/useArrayState";

import {
  PopoverChildContextProvider,
  usePopoverChild,
} from "./PopoverChildContext";

export interface PopoverProps {
  anchorEl: Element | VirtualElement | null;
  placement?: Options["placement"];
  isOpen: boolean;
  onRequestClose?(): void;
}

const noop = () => {
  /*no op*/
};

const Popover: React.FC<PopoverProps> = ({
  isOpen,
  anchorEl,
  placement = "auto",
  onRequestClose = noop,
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

  // Register us as a child of a parent popover, if any is present.
  usePopoverChild(popoverRef);

  const [
    popoverChildren,
    registerPopoverChild,
    unregisterPopoverChild,
  ] = useArrayState<HTMLElement>();

  // Close when a click happens on the outside.
  // We still want to handle this even if we are a child, as the user
  // may have clicked on a parent popover which should close us.
  const insideRefs = React.useMemo(() => [popoverRef, ...popoverChildren], [
    popoverChildren,
    popoverRef,
  ]);
  useOutsideMouseEvent(insideRefs, onRequestClose);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <PopoverChildContextProvider
      registerPopoverChild={registerPopoverChild}
      unregisterPopoverChild={unregisterPopoverChild}
    >
      <div ref={setPopoverRef} style={styles.popper} {...attributes.popper}>
        {children}
      </div>
    </PopoverChildContextProvider>,
    document.body
  );
};

export default Popover;
