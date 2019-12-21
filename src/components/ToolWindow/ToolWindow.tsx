import * as React from "react";

import styles from "./ToolWindow.module.css";

const ToolWindow: React.FC = ({ children }) => {
  return <div className={styles.toolwindow}>{children}</div>;
};

export default ToolWindow;
