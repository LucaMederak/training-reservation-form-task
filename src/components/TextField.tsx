import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import ErrorIcon from "../icons/ErrorIcon";

type ITextFieldProps = {
  label: string;
  errorMessage?: string;
} & ComponentProps<"input">;

const TextField = ({
  className,
  errorMessage,
  label,
  ...inputProps
}: ITextFieldProps) => {
  return (
    <div className="flex flex-col space-y-2 ">
      <label
        htmlFor={inputProps.name}
        className="text-sm font-normal text-textDefault"
      >
        {label}
      </label>
      <input
        {...inputProps}
        className={twMerge(
          `w-full sm:w-[426px] h-12 rounded-lg text-textDefault font-medium text-base px-4 py-[18px] border border-borderDefault focus:border-2 focus:outline-none focus:ring-0 focus:border-borderActive focus:bg-primary-50 ${
            errorMessage && "border-2 border-[#ED4545] bg-[#FEECEC]"
          }`
        )}
      />
      {errorMessage && (
        <div className="flex space-x-2">
          <span>
            <ErrorIcon color="#ED4545" />
          </span>

          <span className="text-sm font-normal text-textDefault">
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextField;
