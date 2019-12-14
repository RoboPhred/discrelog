import * as React from "react";
import { createPortal } from "react-dom";

import PopperJS from "popper.js";

export type PopperPlacement =
  | "top-start"
  | "top"
  | "top-end"
  | "left-start"
  | "left"
  | "left-end"
  | "right-start"
  | "right"
  | "right-end"
  | "bottom-start"
  | "bottom"
  | "bottom-end";
export interface PopperProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  placement: PopperPlacement;
  anchorEl: Element | null;
}

const Popper: React.FC<PopperProps> = ({
  isOpen,
  placement,
  anchorEl,
  children,
  ...divProps
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<PopperJS | null>(null);

  const handleClose = () => {
    if (!popperRef.current) {
      return;
    }

    popperRef.current.destroy();
    popperRef.current = null;
  };

  const handleOpen = () => {
    const popperNode = contentRef.current;
    if (!popperNode || !anchorEl || !isOpen) {
      return;
    }

    handleClose();

    popperRef.current = new PopperJS(anchorEl, popperNode, {
      placement,
      modifiers: {
        // We portal into document.body,
        //  so set the boundary element to the window.
        preventOverflow: {
          boundariesElement: "window"
        }
      }
    });
  };

  // Handle open/closed transition.
  React.useEffect(() => {
    if (isOpen) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [isOpen]);

  // Destroy instance on unmount.
  React.useEffect(() => {
    return handleClose;
  }, []);

  if (!isOpen) {
    return null;
  }

  const contentNode = (
    <div ref={contentRef} {...divProps}>
      {children}
    </div>
  );

  return createPortal(contentNode, document.body);
};

export default Popper;
