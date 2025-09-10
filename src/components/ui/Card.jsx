import React from "react";
import clsx from "clsx";

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-gray-800 border-gray-700 shadow-md p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
