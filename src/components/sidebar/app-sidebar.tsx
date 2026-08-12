"use client";
import type { User } from "better-auth";
import type { ComponentProps } from "react";
import { NavMain, NavUser, TeamSwitcher } from "~/components/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

import { FrameIcon, MapIcon, PieChartIcon, Settings2Icon, Trophy, UserIcon } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Tournaments",
      url: "/tournaments",
      icon: <Trophy />,
      isExpanded: true,
      isActive: true,
      items: [
        { title: "View All", url: "/tournaments" },
        { title: "Create Tournament", url: "/tournaments/create" },
      ],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: <UserIcon />,
      isExpanded: true,
      items: [
        { title: "Overview", url: "/profile" },
        { title: "Edit Profile", url: "/profile/edit" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      isExpanded: true,
      items: [
        { title: "General", url: "#" },
        { title: "Account", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: <FrameIcon /> },
    { name: "Sales & Marketing", url: "#", icon: <PieChartIcon /> },
    { name: "Travel", url: "#", icon: <MapIcon /> },
  ],
};

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  user: User;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
