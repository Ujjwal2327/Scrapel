import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {children}
      <Separator className="h-0.5" />
      <footer className="flex items-center justify-between p-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  );
}
