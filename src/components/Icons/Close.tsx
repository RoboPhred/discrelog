import * as React from "react";

import { cls } from "@/utils";

import styles from "./Icons.module.css";

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width={16}
      height={16}
      {...props}
      className={cls(styles.icon, props.className)}
    >
      <path d="M4,4 L12,12 M4,12 L12,4" />
    </svg>
  );
};

export default CloseIcon;
