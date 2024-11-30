"use client";
import { Coins, Home, Layers2, ShieldCheck } from "lucide-react";
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
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "",
    icon: Home,
  },
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
    title: "Billing",
    url: "biling",
    icon: Coins,
  },
];

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const activeItem =
    items.find((item) => item.url.length > 0 && pathname.includes(item.href)) ||
    items[0];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Logo />
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem.url === item.url}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.url}
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
