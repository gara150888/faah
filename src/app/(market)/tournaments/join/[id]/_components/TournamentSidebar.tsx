"use client";

import { Calendar, Info, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { Tournament } from "./types";
import { cn } from "~/lib/utils";

const formatDateTime = (date: Date | string | null) => date
  ? new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }) : "N/A";

export default function TournamentSidebar({ tournament }: { tournament: Tournament | null }) {

  if (!tournament) return null;

  const mode = tournament.mode.charAt(0).toUpperCase() + tournament.mode.slice(1);

  const timeline = [
    ["Registration Start", tournament.registrationStart],
    ["Registration End", tournament.registrationEnd],
    ["Tournament Start", tournament.startDate],
    ["Tournament End", tournament.endDate],
  ] as const;

  const info = [
    ["Game", tournament.gameName],
    ["Mode", mode],
    ["Team Size", `${tournament.teamSize} Players`],
    ["Max Teams", tournament.maxTeams],
    ["Visibility", tournament.visibility],
    ["Organized By", "Game Arena"],
    ["Region", "India"],
  ] as const;

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <Card>
        <CardHeader className="">
          <CardTitle className="text-sm font-medium">
            Tournament Timeline
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {timeline.map(([label, date]) => (
            <div key={label} className="flex items-start gap-3">
              <Calendar className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(date)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Tournament Info
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 text-sm">
            {info.map(([label, value], i) => (
              <div key={label}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={cn("font-medium text-foreground", label === "Visibility" && "capitalize")}>
                    {value}
                  </span>
                </div>
                {/* {i < info.length - 1 && <Separator />} */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mb-3 text-xs text-muted-foreground">
            If you face any issues while joining, please contact the organizer.
          </p>

          <Button variant="outline" className="w-full gap-2 rounded-2xl" size="sm">
            <MessageSquare className="size-4" />
            Contact Organizer
          </Button>
        </CardContent>
      </Card>

      {/* Notice */}
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