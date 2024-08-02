import React from "react";

type ArrowRightIconProps = {
  color?: string;
};

const ArrowRightIcon = ({ color }: ArrowRightIconProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.5 16.866C23.1667 16.4811 23.1667 15.5189 22.5 15.134L13.5 9.93782C12.8333 9.55292 12 10.034 12 10.8038L12 21.1962C12 21.966 12.8333 22.4471 13.5 22.0622L22.5 16.866Z"
        fill={color || "#CBB6E5"}
      />
    </svg>
  );
};

export default ArrowRightIcon;
