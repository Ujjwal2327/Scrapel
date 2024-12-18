"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ExecuteButton } from "./ExecuteButton";
import { SaveButton } from "./SaveButton";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";

export function Topbar({ title, subtitle, workflowId, hideButtons = false }) {
  const router = useRouter();

  return (
    <header className="flex flex-wrap gap-x-10 gap-y-3 p-2 border-b-2 border-separate justify-between items-center w-full sticky top-0 bg-background z-10">
      <div className="flex items-center gap-1">
        <TooltipWrapper content="Back" side="right" delay={700}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              router.push("/workflows");
            }}
          >
            <ChevronLeft size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold break-keep">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground text-ellipsis break-all">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {!hideButtons && (
        <div className="flex gap-x-3">
          <ExecuteButton workflowId={workflowId} />
          <SaveButton workflowId={workflowId} />
        </div>
      )}
    </header>
  );
}
