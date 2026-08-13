"use client";

import { FileText, Info, Trophy, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import JoinSection from "./JoinSection";

type TournamentTabsProps = {
  tournamentId: string;
  userTeams: { id: string; name: string; image: string | null }[];
  userId: string;
};

export default function TournamentTabs({ tournamentId, userTeams, userId }: TournamentTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="overview" className="gap-1.5">
          <Info className="size-3.5" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="details" className="gap-1.5">
          <FileText className="size-3.5" />
          Details
        </TabsTrigger>
        <TabsTrigger value="rules" className="gap-1.5">
          <Trophy className="size-3.5" />
          Rules
        </TabsTrigger>
        <TabsTrigger value="prizes" className="gap-1.5">
          <Trophy className="size-3.5" />
          Prizes
        </TabsTrigger>
        <TabsTrigger value="join" className="gap-1.5">
          <Users className="size-3.5" />
          Join Tournament
        </TabsTrigger>
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

      <TabsContent value="prizes" className="mt-4">
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
          <h3 className="text-lg font-semibold mb-2">Prizes</h3>
          <p className="text-sm text-muted-foreground">
            Tournament prizes content goes here.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="join" className="mt-4">
        <JoinSection tournamentId={tournamentId} userTeams={userTeams} userId={userId} />
      </TabsContent>
    </Tabs>
  );
}
