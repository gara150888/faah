"use client";

import React from "react";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface TournamentDetailsSectionProps {
  computedMaxTeams: number;
  computedTeamSize: number;
  computedParticipants: number;
  watchedMode: string | undefined;
  region: string;
  setRegion: (value: string) => void;
  prizePool: string;
  setPrizePool: (value: string) => void;
  matches: string;
  setMatches: (value: string) => void;
}

export function TournamentDetailsSection({
  computedMaxTeams,
  computedTeamSize,
  computedParticipants,
  watchedMode,
  region,
  setRegion,
  prizePool,
  setPrizePool,
  matches,
  setMatches,
}: TournamentDetailsSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Tournament Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Max Teams <span className="text-destructive">*</span>
            </Label>
            <Input
              value={computedMaxTeams}
              disabled
              className="h-9 rounded-2xl bg-muted/30 cursor-not-allowed text-muted-foreground"
            />
            <p className="text-[10px] text-muted-foreground">Locked to mode: {watchedMode}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Team Size <span className="text-destructive">*</span>
            </Label>
            <Input
              value={computedTeamSize}
              disabled
              className="h-9 rounded-2xl bg-muted/30 cursor-not-allowed text-muted-foreground"
            />
            <p className="text-[10px] text-muted-foreground">Locked to mode: {watchedMode}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Region <span className="text-destructive">*</span>
            </Label>
            <Select value={region} onValueChange={(v) => v && setRegion(v)}>
              <SelectTrigger className="h-9 w-full rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Prize Pool (₹) <span className="text-destructive">*</span>
            </Label>
            <Input
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              className="h-9 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Matches <span className="text-destructive">*</span>
            </Label>
            <Input
              value={matches}
              onChange={(e) => setMatches(e.target.value)}
              className="h-9 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Participants <span className="text-destructive">*</span>
            </Label>
            <Input
              value={computedParticipants}
              disabled
              className="h-9 rounded-2xl bg-muted/30 cursor-not-allowed text-muted-foreground"
            />
            <p className="text-[10px] text-muted-foreground">Locked to mode: {watchedMode}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
