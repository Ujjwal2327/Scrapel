import { useState } from "react";
import { Coins, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
            ? "w-full h-full sm:w-90 sm:h-full opacity-100 pb-10 overflow-y-auto py-2 px-4"
            : "w-full h-0 sm:w-0 sm:h-full opacity-0"
        )}
      >
        <Accordion
          type="multiple"
          defaultValue={[
            "interaction",
            "extraction",
            "storage",
            "timing",
            "result",
          ]}
          className="w-full"
        >
          <AccordionItem value="interaction">
            <AccordionTrigger className="font-bold">
              User Interactions
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              <TaskMenuButton taskType={TaskType.CLICK_ELEMENT} />
              <TaskMenuButton taskType={TaskType.FILL_INPUT} />
              <TaskMenuButton taskType={TaskType.NAVIGATE_URL} />
              <TaskMenuButton taskType={TaskType.SCROLL_TO_ELEMENT} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="extraction">
            <AccordionTrigger className="font-bold">
              Data Extraction
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              <TaskMenuButton taskType={TaskType.EXTRACT_DATA_WITH_AI} />
              <TaskMenuButton taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
              <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="storage">
            <AccordionTrigger className="font-bold">
              Data storage
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              <TaskMenuButton taskType={TaskType.ADD_PROPERTY_TO_JSON} />
              <TaskMenuButton taskType={TaskType.READ_PROPERTY_FROM_JSON} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="timing">
            <AccordionTrigger className="font-bold">
              Timing Controls
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              <TaskMenuButton taskType={TaskType.WAIT_FOR_ELEMENT} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="result">
            <AccordionTrigger className="font-bold">
              Result Delivery
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              <TaskMenuButton taskType={TaskType.DELIVER_VIA_WEBHOOK} />
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
      <div className="flex gap-2 items-center">
        <task.icon size={20} />
        {task.label}
      </div>
      <Badge variant="outline" size="sm" className="flex gap-2 items-center">
        <Coins size={16} />
        {task.credits}
      </Badge>
    </Button>
  );
}
