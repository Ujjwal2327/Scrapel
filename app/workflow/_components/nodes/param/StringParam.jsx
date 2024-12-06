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
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <Component
        id={id}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
        disabled={disabled}
        placeholder={
          disabled ? "Value added automatically" : "Enter value here"
        }
        className={cn("text-xs h-auto", disabled && "resize-none")}
        style={disabled ? { height: "auto" } : undefined}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}
