import * as React from "react";

import { cls } from "@/utils";

import styles from "./Icons.module.css";

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width={16}
      height={16}
      {...props}
      className={cls(styles.icon, props.className)}
    >
      <path d="M2.5,1 L6.5,1 L6.5,15 L2.5,15 z M9.5,1 L13.5,1 L13.5,15 L9.5,15 z" />
    </svg>
  );
};

export default PauseIcon;
