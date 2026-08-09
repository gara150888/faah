"use client";


import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "~/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";

export function TeamSwitcher() {

  const [activeTeam] = useState({
    name: "Acme Inc",
    logo: <GalleryVerticalEndIcon />,
    plan: "Enterprise",
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {activeTeam.logo}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeTeam.name}</span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
              </SidebarMenuButton>
            }
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
