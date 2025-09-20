import React from "react";

import { cn } from "@/lib/utils";

interface HeadingProps extends React.ComponentProps<"h1"> {
  type: "H1" | "H2" | "H3";
}
export const Heading: React.FC<HeadingProps> = ({
  type,
  children,
  ...props
}) => {
  const className = cn(
    "font-semibold text-black-90",
    {
      "text-[20px]": type === "H1",
      "text-[16px]": type === "H2",
      "text-[14px]": type === "H3",
    },
    props.className
  );
  if (type === "H1")
    return (
      <h1 {...props} className={className}>
        {children}
      </h1>
    );

  if (type === "H2")
    return (
      <h2 {...props} className={className}>
        {children}
      </h2>
    );

  return (
    <h3 {...props} className={className}>
      {children}
    </h3>
  );
};
