import * as React from "react";

import { cls } from "@/utils";

import styles from "./Icons.module.css";

const StepIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width={16}
      height={16}
      {...props}
      className={cls(styles.icon, props.className)}
    >
      <path d="M3,0 L13,8 L3,16 z M11,1 l2,0 l0,14 l-2,0 z" />
    </svg>
  );
};

export default StepIcon;
