import * as React from "react";
import { createUseStyles } from "react-jss";

import Popper, { PopperPlacement } from "./Popper";

export interface PopupMenuProps {
  isOpen: boolean;
  placement: PopperPlacement;
  anchorEl: Element | null;
}

const useStyles = createUseStyles({
  root: {
    background: "white",
    display: "flex",
    flexFlow: "column nowrap",
    minWidth: "150px"
  }
});
const PopupMenu: React.FC<PopupMenuProps> = ({
  isOpen,
  placement,
  anchorEl,
  children
}) => {
  const styles = useStyles();
  return (
    <Popper
      className={styles.root}
      isOpen={isOpen}
      placement={placement}
      anchorEl={anchorEl}
    >
      {children}
    </Popper>
  );
};

export default PopupMenu;
