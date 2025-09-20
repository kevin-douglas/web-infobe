import React from "react";

import { Paragraph } from "@/components/Typography/Paragraph";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface InputDefaultProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  icon?: string;
  errorMessage?: string;
  hasValue?: boolean;
}

export function InputDefault<T extends FieldValues>({
  id,
  label,
  register,
  icon,
  errorMessage,
  hasValue,
  ...props
}: InputDefaultProps<T>) {
  return (
    <Label className="flex flex-col w-full gap-2 items-start">
      <Paragraph type="P1">{label}</Paragraph>

      <div className="relative w-full group gap-1 flex flex-col">
        <Input
          {...props}
          {...register(id)}
          autoComplete="off"
          className={cn(
            "bg-white w-full h-12 border-primary-20 border-[1px] text-primary-200 placeholder:text-primary-20 text-[16px] font-semibold transition-colors rounded-[12px]",
            "focus-visible:text-primary-200 focus-visible:ring-primary-200 focus-visible:ring-[1.5px] selection:text ",
            "selection:bg-primary-100 selection:text-white",
            {
              "border-system-error text-system-error placeholder:text-system-error focus-visible:ring-system-error focus-visible:text-system-error":
                !!errorMessage,
              "pl-[56px] ": !!icon,
            }
          )}
        />

        {icon && (
          <div className="absolute left-4 top-3">
            <Icon
              icon={icon}
              className={cn(
                "min-w-6 w-6 min-h-6 h-6 transition-colors text-primary-20",
                "group-focus-within:text-primary-200",
                {
                  "text-primary-200": hasValue,
                  "group-focus-within:text-system-error text-system-error":
                    !!errorMessage,
                }
              )}
            />
          </div>
        )}

        {!!errorMessage && (
          <Paragraph type="P2" className="text-system-error text-right">
            {errorMessage}
          </Paragraph>
        )}
      </div>
    </Label>
  );
}
