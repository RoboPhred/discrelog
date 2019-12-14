import * as React from "react";
import { createUseStyles } from "react-jss";
import MenuItem from "./MenuItem";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-start",
    alignItems: "baseline",
    padding: "8px 10px",
    backgroundColor: "#f8f9fa"
  },
  brand: {
    marginRight: "15px",
    fontSize: "1.2rem",
    fontWeight: "bold"
  },
  menuItem: {
    padding: "0 0.5rem",
    fontSize: "0.9rem"
  }
});

const TitleBar: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <span className={styles.brand}>Discrelog</span>
      <MenuItem title="File" childPlacement="bottom-start">
        <span>Foo</span>
        <span>Bar</span>
      </MenuItem>
    </div>
  );
};

export default TitleBar;
