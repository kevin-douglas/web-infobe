/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";

import { Paragraph } from "@/components/Typography/Paragraph";
import { Input } from "@/components/ui/input";
import { Label as ShadLabel } from "@/components/ui/label";
import { Control, FieldValues, Path, UseFormRegister, useController } from "react-hook-form";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

function applyMask(value: string, mask: string): string {
  if (!value || !mask) return value;
  let result = "";
  let valueIndex = 0;
  const cleanValue = removeMask(value, mask);
  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    const m = mask[i];
    const v = cleanValue[valueIndex];
    if (m === "9" && /\d/.test(v)) { result += v; valueIndex++; }
    else if (m === "A" && /[a-zA-Z]/.test(v)) { result += v; valueIndex++; }
    else if (m === "*" && /[a-zA-Z0-9]/.test(v)) { result += v; valueIndex++; }
    else if (!["9","A","*"].includes(m)) { result += m; }
    else break;
  }
  return result;
}
function isMaxLengthReached(value: string, mask: string): boolean {
  if (!mask) return false;
  const expected = mask.split("").filter(c => ["9","A","*"].includes(c)).length;
  const clean = removeMask(value, mask);
  return clean.length >= expected;
}
function removeMask(value: string, mask?: string): string {
  if (!mask) return value;
  const fixedChars = mask.split("").filter(c => !["9","A","*"].includes(c)).join("");
  const unique = Array.from(new Set(fixedChars.split("")));
  const dashIndex = unique.indexOf("-");
  if (dashIndex !== -1) { unique.splice(dashIndex,1); unique.unshift("-"); }
  const fixedForRegex = unique.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("");
  let result = value;
  if (fixedForRegex.length > 0) {
    const re = new RegExp(`[${fixedForRegex}]`,"g");
    result = result.replace(re,"");
  }
  const chars = new Set(mask.split(""));
  let allowed = "";
  if (chars.has("9") && (chars.has("A") || chars.has("*"))) allowed = "a-zA-Z\\d";
  else if (chars.has("A") && chars.has("*")) allowed = "a-zA-Z\\d";
  else if (chars.has("9")) allowed = "\\d";
  else if (chars.has("A")) allowed = "a-zA-Z";
  else if (chars.has("*")) allowed = "a-zA-Z\\d";
  if (allowed) {
    const re = new RegExp(`[^${allowed}]`,"g");
    result = result.replace(re,"");
  }
  return result;
}

interface InputMaskProps<T extends FieldValues> extends React.ComponentProps<"input"> {
  id: Path<T>;
  label: string;
  register?: UseFormRegister<T>;
  control?: Control<T>;
  icon?: string;
  errorMessage?: string;
  mask?: string;
}

export function InputMask<T extends FieldValues>({
  id,
  label,
  register,
  control,
  icon,
  errorMessage,
  mask,
  className,
  ...props
}: InputMaskProps<T>) {
  const controller = control
    ? useController({ name: id as Path<T>, control, defaultValue: "" as any })
    : null;

  const fieldValue = controller ? String(controller.field.value ?? "") : String((props as any).value ?? "");
  const [displayValue, setDisplayValue] = useState<string>(mask ? applyMask(fieldValue, mask) : fieldValue);

  useEffect(() => {
    if (!mask) return;
    setDisplayValue(applyMask(fieldValue, mask));
  }, [fieldValue, mask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mask) {
      controller?.field.onChange(e);
      (props as any).onChange?.(e);
      return;
    }

    const inputValue = e.target.value;
    const clean = removeMask(inputValue, mask);

    if (isMaxLengthReached(displayValue, mask)) {
      const currentClean = removeMask(displayValue, mask);
      if (clean.length > currentClean.length) return;
    }

    const masked = applyMask(clean, mask);
    setDisplayValue(masked);

    if (controller) {
      controller.field.onChange(clean);
    } else if (register) {
      const registered = register(id as Path<T>);
      registered.onChange?.({
        ...e,
        target: { ...e.target, value: clean },
      } as any);
    }

    (props as any).onChange?.({ ...e, target: { ...e.target, value: clean } });
  };

  const hasValue = mask ? displayValue?.length > 0 : Boolean(fieldValue && String(fieldValue).length > 0);

  return (
    <ShadLabel className="flex flex-col w-full gap-2 items-start">
      <Paragraph type="P1">{label}</Paragraph>

      <div className="relative w-full group gap-1 flex flex-col">
        <Input
          id={id as string}
          autoComplete="off"
          placeholder={props.placeholder}
          {...(!mask && register ? register(id) : {})}
          {...(controller ? {} : props)}
          value={mask ? displayValue : undefined}
          onChange={mask ? handleChange : props.onChange}
          onBlur={controller?.field.onBlur}
          className={cn(
            "bg-white w-full h-12 border-primary-20 border-[1px] text-primary-200 placeholder:text-primary-20 text-[16px] font-semibold transition-colors rounded-[12px]",
            "focus-visible:text-primary-200 focus-visible:ring-primary-200 focus-visible:ring-[1.5px]",
            "selection:bg-primary-100 selection:text-white",
            icon && "pl-[56px]",
            !!errorMessage && "border-system-error text-system-error placeholder:text-system-error focus-visible:ring-system-error",
            className
          )}
        />

        {icon && (
          <div className="absolute left-4 top-3">
            <Icon
              icon={icon}
              className={cn(
                "min-w-6 w-6 min-h-6 h-6 transition-colors",
                "text-primary-20",
                "group-focus-within:text-primary-200",
                hasValue && "text-primary-200",
                !!errorMessage && "text-system-error"
              )}
            />
          </div>
        )}

        {!!errorMessage && <Paragraph type="P2" className="text-system-error text-right">{errorMessage}</Paragraph>}
      </div>
    </ShadLabel>
  );
}
