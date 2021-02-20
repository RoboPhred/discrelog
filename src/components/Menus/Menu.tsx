import * as React from "react";

import styles from "./Menus.module.css";

const Menu: React.FC = ({ children }) => {
  return <ul className={styles["menu"]}>{children}</ul>;
};

export default Menu;
