import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectParam({ param, value, updateNodeParamValue, disabled }) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex gap-x-2 flex-wrap">
        {param.name}
        {param.required && <span className="text-red-400">*</span>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option">
            {param.options.find((option) => option.value === value)?.label ||
              "Select an option"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {!param.required && (
              <SelectItem
                value={undefined}
                className="text-muted-foreground focus:text-muted-foreground"
              >
                None
              </SelectItem>
            )}
            {param.options.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
