import * as React from "react";

export type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;

import styles from "./Button.module.css";

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button className={styles["button"]} type="button" {...props}>
      {props.children}
    </button>
  );
};

export default Button;
