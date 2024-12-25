import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NavigationTabs({ workflowId }) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const activeValue = segments.length === 4 ? segments[2] : "invalid";

  return (
    <Tabs value={activeValue} className="w-[200px]">
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
