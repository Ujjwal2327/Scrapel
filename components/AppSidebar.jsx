"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesCombined, Coins, Layers2, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { UserAvailableCreditsBadge } from "./UserAvailableCreditsBadge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Workflows",
    url: "workflows",
    icon: Layers2,
  },
  {
    title: "Credentials",
    url: "credentials",
    icon: ShieldCheck,
  },
  {
    title: "Dashboard ",
    url: "dashboard",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Billing",
    url: "biling",
    icon: Coins,
  },
];

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const activeItem =
    items.find((item) => item.url.length > 0 && pathname.includes(item.url)) ||
    items[0];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="space-y-7">
          <SidebarGroupLabel className="flex justify-center">
            <Logo href="/" />
          </SidebarGroupLabel>
          <SidebarGroupLabel>
            <UserAvailableCreditsBadge />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem.url === item.url}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.url.length ? item.url : "/"}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
