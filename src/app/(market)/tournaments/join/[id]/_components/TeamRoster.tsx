"use client";

import { Crown, User } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";

type Player = {
  id: string;
  name: string;
  role: "captain" | "player";
};

type TeamRosterProps = {
  teamName: string;
  players: Player[];
  isLoading?: boolean;
  currentUserId?: string;
};

export default function TeamRoster({ teamName, players, isLoading, currentUserId }: TeamRosterProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{teamName}</h3>
          <p className="text-xs text-muted-foreground">
            {players.length} / 4 Players
          </p>
        </div>
        <Select defaultValue="captain">
          <SelectTrigger className="h-8 w-32 text-xs rounded-xl">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="captain">Captain</SelectItem>
            <SelectItem value="player">Player</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {players.map((player, index) => (
          <div key={player.id} className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs font-bold">
                {player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground flex-1">{player.name}</span>
            {player.role === "captain" ? (
              <Badge variant="default" className="rounded-full bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300 gap-1">
                <Crown className="size-3" />
                Captain
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full gap-1">
                <User className="size-3" />
                Player
              </Badge>
            )}
            {player.id === currentUserId && (
              <Badge variant="default" className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
                You
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
