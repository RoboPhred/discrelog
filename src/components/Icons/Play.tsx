import * as React from "react";

import { cls } from "@/utils";

import styles from "./Icons.module.css";

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width={16}
      height={16}
      {...props}
      className={cls(styles.icon, props.className)}
    >
      <path d="M3,0 L13,8 L3,16 z" />
    </svg>
  );
};

export default PlayIcon;
