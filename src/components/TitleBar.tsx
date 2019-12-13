import * as React from "react";
import { createUseStyles } from "react-jss";

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
    marginRight: "10px",
    fontSize: "1.2rem"
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
      {/* <span className={styles.menuItem}>File</span>
      <span className={styles.menuItem}>Edit</span> */}
    </div>
  );
};

export default TitleBar;
