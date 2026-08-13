"use client";

import { Calendar, Info, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { Tournament } from "./types";

type TournamentSidebarProps = {
  tournament?: Tournament;
};

function formatDateTime(date: Date | string | null) {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TournamentSidebar({ tournament }: TournamentSidebarProps) {
  if (!tournament) return null;

  const modeLabel = tournament.mode.charAt(0).toUpperCase() + tournament.mode.slice(1);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tournament Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">Registration Start</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(tournament.registrationStart)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">Registration End</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(tournament.registrationEnd)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">Tournament Start</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(tournament.startDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">Tournament End</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(tournament.endDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tournament Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Game</span>
              <span className="font-medium text-foreground">{tournament.gameName}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode</span>
              <span className="font-medium text-foreground">{modeLabel}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Team Size</span>
              <span className="font-medium text-foreground">{tournament.teamSize} Players</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Teams</span>
              <span className="font-medium text-foreground">{tournament.maxTeams}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Visibility</span>
              <span className="font-medium text-foreground capitalize">{tournament.visibility}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organized By</span>
              <span className="font-medium text-foreground">Game Arena</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region</span>
              <span className="font-medium text-foreground">India</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            If you face any issues while joining, please contact the organizer.
          </p>
          <Button variant="outline" className="w-full rounded-2xl gap-2" size="sm">
            <MessageSquare className="size-4" />
            Contact Organizer
          </Button>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="flex items-start gap-3 pt-4 pb-4">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <Info className="size-3" />
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>All team members must be registered before the registration closes.</p>
            <p>Players cannot be changed after the registration ends.</p>
            <p>Make sure to read all tournament rules before participating.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
