"use client";
import { NavMain, NavUser, TeamSwitcher } from "~/components/sidebar";
import type { User } from "better-auth";
import type { ComponentProps } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

import {
  FrameIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  TerminalSquareIcon,
  UserIcon,
  WorkflowIcon
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Playground",
      url: "/dashboard",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "WorkFlows",
      url: "/workflows",
      icon: <WorkflowIcon />,
      isActive: false,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: <UserIcon />,
      items: [
        { title: "Overview", url: "/profile" },
        { title: "Edit Profile", url: "/profile/edit" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
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
