import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function StringParam({ param, value, updateNodeParamValue, disabled }) {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const Component = param.variant === "textarea" ? Textarea : Input;

  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={id} className="text-xs flex gap-x-2 flex-wrap">
        {param.name}
        {param.required && <span className="text-red-400">*</span>}
      </Label>
      <Component
        id={id}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
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
