import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SaveButton } from "./SaveButton";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";

export function Topbar({ title, subtitle, workflowId }) {
  const router = useRouter();

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between items-center w-full min-h-14 sticky top-0 bg-background z-10">
      <div className="flex items-center gap-1 flex-1">
        <TooltipWrapper content="Back" side="right">
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
          <p className="font-bold text-ellipsis break-all">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground text-ellipsis break-all">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <SaveButton workflowId={workflowId} />
    </header>
  );
}
