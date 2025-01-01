import { useEffect, useId, useState } from "react";
import { cn, formatToNumberString } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function NumberParam({ param, value, updateNodeParamValue, disabled }) {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={id} className="text-xs flex gap-x-2 flex-wrap">
        {param.name}
        {!param.required && <span className="text-red-400">*</span>}
        {param.min !== undefined && param.max !== undefined && (
          <span className="text-gray-500">
            (Range: {param.min} - {param.max})
          </span>
        )}
      </Label>

      <Input
        id={id}
        defaultValue={param.default}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => {
          const stringValue = formatToNumberString(
            e.target.value,
            param.min,
            param.max,
            param.default
          );
          updateNodeParamValue(stringValue);
          setInternalValue(stringValue);
        }}
        min={param.min}
        max={param.max}
        disabled={disabled}
        placeholder={
          disabled
            ? "Value added automatically"
            : param.placeholder
            ? param.placeholder
            : "Enter value here"
        }
        className={cn(
          "text-xs h-auto bg-background",
          disabled && "resize-none"
        )}
        style={disabled ? { height: "auto" } : undefined}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}
