"use client";

import type { LucideIcon } from "lucide-react";
import { FileText, Info, ShieldHalf, Trophy, Users } from "lucide-react";
import { useSidebar } from "~/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import JoinSection from "./join-feature/JoinSection";
import TeamsSection from "./TeamsSection";

type TournamentTabsProps = {
  tournamentId: string;
  userTeams: { id: string; name: string; image: string | null }[];
  userId: string;
  teamSize: number;
};

type TabItem = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const TABS: TabItem[] = [
  { value: "overview", label: "Overview", icon: Info },
  { value: "details", label: "Details", icon: FileText },
  { value: "rules", label: "Rules", icon: Trophy },
  { value: "teams", label: "Teams", icon: ShieldHalf },
  { value: "join", label: "Join Tournament", icon: Users },
];

export default function TournamentTabs({
  tournamentId,
  teamSize,
  userTeams: _userTeams,
  userId: _userId,
}: TournamentTabsProps) {
  const { isMobile } = useSidebar();

  return (
    <Tabs orientation={isMobile ? "vertical" : undefined} defaultValue="join" className="w-full flex flex-col">
      <TabsList variant="line" className="w-full justify-start">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
            <tab.icon className="size-3.5" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p className="text-sm text-muted-foreground">
            Tournament overview content goes here.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="details" className="mt-4">
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <p className="text-sm text-muted-foreground">
            Tournament details content goes here.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="rules" className="mt-4">
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
          <h3 className="text-lg font-semibold mb-2">Rules</h3>
          <p className="text-sm text-muted-foreground">
            Tournament rules content goes here.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="teams" className="mt-4">
        <TeamsSection tournamentId={tournamentId} teamSize={teamSize} />
      </TabsContent>

      <TabsContent value="join" className="mt-4">
        <JoinSection tournamentId={tournamentId} teamSize={teamSize} />
      </TabsContent>
    </Tabs>
  );
}
