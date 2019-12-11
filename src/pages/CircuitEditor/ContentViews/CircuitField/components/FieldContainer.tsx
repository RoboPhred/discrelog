import * as React from "react";
import { createUseStyles } from "react-jss";

import { cls } from "@/utils";

export interface FieldContainerProps {
  className?: string;
}

const useStyles = createUseStyles({
  root: {
    overflow: "hidden"
  }
});

const FieldContainer: React.FC<FieldContainerProps> = ({ className, children }) => {
  const styles = useStyles();
  return (
    <div className={cls(className, styles.root)}>{children}</div>
  );
}

export default FieldContainer;
