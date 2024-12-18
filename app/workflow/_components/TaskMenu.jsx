import { useState } from "react";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TooltipWrapper } from "@/components/TooltipWrapper";

export function TaskMenu() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        "sm:h-full flex flex-col items-center",
        open && "border-b-2 sm:border-b-0 sm:border-r-2"
      )}
    >
      <TooltipWrapper content="Toggle menu" side="right" delay={700}>
        <Button
          onClick={() => setOpen((prev) => !prev)}
          variant="ghost"
          size="icon"
          className="self-start"
        >
          <PanelLeft />
        </Button>
      </TooltipWrapper>
      <aside
        className={cn(
          "transition-all duration-300 ease-in-out",
          open
            ? "w-full h-full sm:w-80 sm:h-full opacity-100 pb-10 overflow-y-auto py-2 px-4"
            : "w-full h-0 sm:w-0 sm:h-full opacity-0"
        )}
      >
        <Accordion
          type="multiple"
          defaultValue={["extraction"]}
          className="w-full"
        >
          <AccordionItem value="extraction">
            <AccordionTrigger className="font-bold">
              Data extraction
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} />
              <TaskMenuButton taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </aside>
    </div>
  );
}

function TaskMenuButton({ taskType }) {
  const task = TaskRegistry[taskType];

  const onDragStart = (e) => {
    e.dataTransfer.setData("application/reactflow", taskType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      draggable
      onDragStart={onDragStart}
      variant="secondary"
      className="flex justify-between items-center gap-2 border w-full"
    >
      <task.icon size={20} />
      {task.label}
    </Button>
  );
}
