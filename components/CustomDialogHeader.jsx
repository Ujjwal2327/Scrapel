"use client";
import { cn } from "@/lib/utils";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function CustomDialogHeader({
  icon: Icon,
  title,
  subtitle,
  iconClassName = "",
  titleClassName = "",
  subtitleClassName = "",
}) {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && (
            <Icon size={30} className={cn("stroke-primary", iconClassName)} />
          )}
          {title && (
            <p className={cn("text-xl text-primary", titleClassName)}>
              {title}
            </p>
          )}
          {subtitle && (
            <p
              className={cn("text-sm text-muted-foreground", subtitleClassName)}
            >
              {subtitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
}
