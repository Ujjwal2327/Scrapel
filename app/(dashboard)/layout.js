import { SignedIn, UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { ModeToggle } from "@/components/ModeToggle";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
            <div className="flex items-center gap-x-2">
              <SidebarTrigger />
              <BreadcrumbHeader />
            </div>
            <div className="flex items-center gap-x-2">
              <ModeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <Separator />
          <div className="overflow-auto">
            <div className="flex-1 container py-4 text-accent-foreground">
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
