"use client";

import React from "react";
import { ClockIcon, EyeIcon, Gamepad2Icon, MapPinIcon, ShieldIcon, TrophyIcon, UsersIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

interface TournamentPreviewProps {
  watchedBanner: string | undefined;
  watchedGameName: string | undefined;
  watchedName: string | undefined;
  watchedStatus: string | undefined;
  watchedMode: string | undefined;
  region: string;
  watchedDescription: string | undefined;
  watchedRegStart: string | Date | undefined;
  watchedRegEnd: string | Date | undefined;
  watchedTournStart: string | Date | undefined;
  watchedTournEnd: string | Date | undefined;
  computedMaxTeams: number;
  computedTeamSize: number;
  computedParticipants: number;
  prizePool: string;
  matches: string;
  watchedVisibility: string | undefined;
}

function formatDateTime(dateTime?: string | Date) {
  if (!dateTime) return "N/A";
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TournamentPreview({
  watchedBanner,
  watchedGameName,
  watchedName,
  watchedStatus,
  watchedMode,
  region,
  watchedDescription,
  watchedRegStart,
  watchedRegEnd,
  watchedTournStart,
  watchedTournEnd,
  computedMaxTeams,
  computedTeamSize,
  computedParticipants,
  prizePool,
  matches,
  watchedVisibility,
}: TournamentPreviewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-medium">Tournament Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-muted">
            {watchedBanner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={watchedBanner}
                alt="Tournament Banner"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {watchedGameName ? watchedGameName.slice(0, 4).toUpperCase() : "BANNER"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{watchedName || "Tournament Title"}</h3>
            <Badge
              variant={
                watchedStatus === "upcoming"
                  ? "default"
                  : watchedStatus === "ongoing"
                    ? "secondary"
                    : "outline"
              }
              className="rounded-full capitalize"
            >
              {watchedStatus}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Gamepad2Icon className="size-4" />
              <span>{watchedGameName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldIcon className="size-4" />
              <span className="capitalize">{watchedMode || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="size-4" />
              <span>{region}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {watchedDescription || "No description provided."}
          </p>

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ClockIcon className="size-4" />
                <span>Registration</span>
              </div>
              <span className="text-foreground text-right text-xs">
                {formatDateTime(watchedRegStart)} - {formatDateTime(watchedRegEnd)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrophyIcon className="size-4" />
                <span>Tournament</span>
              </div>
              <span className="text-foreground text-right text-xs">
                {formatDateTime(watchedTournStart)} - {formatDateTime(watchedTournEnd)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UsersIcon className="size-4" />
                <span>Max Teams</span>
              </div>
              <span className="text-foreground">{computedMaxTeams} Teams</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UsersIcon className="size-4" />
                <span>Team Size</span>
              </div>
              <span className="text-foreground">{computedTeamSize} Players</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrophyIcon className="size-4" />
                <span>Prize Pool</span>
              </div>
              <span className="text-foreground">₹{Number(prizePool).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gamepad2Icon className="size-4" />
                <span>Matches</span>
              </div>
              <span className="text-foreground">{matches}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UsersIcon className="size-4" />
                <span>Participants</span>
              </div>
              <span className="text-foreground">{computedParticipants}</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldIcon className="size-4" />
              <span>Status</span>
            </div>
            <Badge
              variant={
                watchedStatus === "upcoming"
                  ? "default"
                  : watchedStatus === "ongoing"
                    ? "secondary"
                    : "outline"
              }
              className="rounded-full capitalize"
            >
              {watchedStatus}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <EyeIcon className="size-4" />
              <span>Visibility</span>
            </div>
            <Badge variant="outline" className="rounded-full capitalize">
              {watchedVisibility}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="flex items-start gap-3 pt-4 pb-4">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <span className="text-xs font-bold">i</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Once created, you can edit these details anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
