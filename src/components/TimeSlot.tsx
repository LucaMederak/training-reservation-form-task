import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type TimeSlotProps = {
  value: string;
  selected?: boolean;
} & ComponentProps<"button">;

const TimeSlot = ({ value, selected, ...buttonProps }: TimeSlotProps) => {
  return (
    <button
      type="button"
      {...buttonProps}
      className={twMerge(
        `text-base font-normal w-[76px] h-[46px] rounded-lg border border-borderDefault bg-white ${
          selected && "border-2 border-borderActive"
        }`
      )}
    >
      {value}
    </button>
  );
};

export default TimeSlot;
