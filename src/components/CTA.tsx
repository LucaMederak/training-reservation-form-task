import React, { ComponentProps } from "react";

type CTAProps = {
  text?: string;
} & ComponentProps<"button">;

const CTA = ({ text = "Send Application", ...buttonProps }: CTAProps) => {
  return (
    <button
      className="rounded py-4 px-8 space-x-2.5 w-full sm:w-[426px] h-[45px] flex items-center justify-center bg-cta-default disabled:bg-cta-disabled hover:bg-cta-hover text-white text-lg font-medium top-5 left-5"
      {...buttonProps}
    >
      {text}
    </button>
  );
};

export default CTA;
