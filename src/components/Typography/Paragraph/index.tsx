import { cn } from "@/lib/utils";
import React from "react";

interface ParagraphProps extends React.ComponentProps<"p"> {
  type: "P1" | "P2";
}
export const Paragraph: React.FC<ParagraphProps> = ({
  type,
  children,
  ...props
}) => (
  <p
    className={cn(
      "font-normal",
      {
        "text-sm": type === "P1",
        "text-xs": type === "P2",
      },
      props.className
    )}
    {...props}
  >
    {children}
  </p>
);

