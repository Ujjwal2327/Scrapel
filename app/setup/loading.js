import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function SetupPageLoading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <Logo iconSize={50} fontSize="text-4xl" />
      <Separator className="max-w-xs" />
      <div className="flex items-center gap-2 justify-center">
        <Loader2 size={16} className="animate-spin stroke-primary" />
        <p className="text-muted-foreground">Setting up your account</p>
      </div>
    </div>
  );
}
