import * as React from "react";
import { createPortal } from "react-dom";

import { Options, VirtualElement } from "@popperjs/core";
import { usePopper } from "react-popper";

import { cls } from "@/utils";

export interface PopoverProps {
  className?: string;
  anchorEl: Element | VirtualElement | null;
  placement?: Options["placement"];
  isOpen: boolean;
}

import styles from "./Tooltip.module.css";

const Tooltip: React.FC<PopoverProps> = ({
  className,
  isOpen,
  anchorEl,
  placement = "auto",
  children,
}) => {
  const [popoverRef, setPopoverRef] = React.useState<HTMLDivElement | null>(
    null
  );
  const [arrowRef, setArrowRef] = React.useState<HTMLDivElement | null>(null);

  const { attributes, styles: popperStyles } = usePopper(
    isOpen ? anchorEl : null,
    popoverRef,
    {
      placement,
      modifiers: [
        {
          name: "arrow",
          options: {
            element: arrowRef,
          },
        },
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    }
  );

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={setPopoverRef}
      className={cls(styles["tooltip"], className)}
      style={popperStyles.popper}
      role="tooltip"
      {...attributes.popper}
    >
      {children}
      <div
        ref={setArrowRef}
        data-popper-arrow
        className={styles["tooltip-arrow"]}
        style={popperStyles.arrow}
        {...attributes.arrow}
      />
    </div>,
    document.body
  );
};

export default Tooltip;
