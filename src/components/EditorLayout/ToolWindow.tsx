import * as React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    boxSizing: "border-box",
    width: "100%",
    maxHeight: "100%",
    padding: "5px",
    overflow: "auto"
  }
});

const ToolWindow: React.FC = ({ children }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>{children}</div>
  )
}

export default ToolWindow;

