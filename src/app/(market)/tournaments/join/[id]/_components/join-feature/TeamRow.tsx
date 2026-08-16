"use client";

import { Loader2, Send } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

type TeamRowProps = {
  team: {
    id: string;
    name: string;
    image: string | null;
    playerCount: number;
    captainName: string | null;
  };
  teamSize: number;
  spotsLeft: number;
  isPending: boolean;
  onRequest: (teamId: string) => void;
};

export default function TeamRow({ team, teamSize, spotsLeft, isPending, onRequest }: TeamRowProps) {
  const lookingFor = Math.max(0, spotsLeft);

  return (
    <div className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-muted/50">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
        {team.image ? (
          <img
            src={team.image}
            alt={team.name}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-muted-foreground">
            {team.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold text-foreground">
          {team.name}
        </h4>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {team.playerCount}/{teamSize} Players{" "}
          {lookingFor > 0 &&
            `• Looking for ${lookingFor} Player${lookingFor > 1 ? "s" : ""}`}
        </p>
      </div>

      <Badge variant="outline" className="text-xs">
        Competitive
      </Badge>

      <div className="hidden min-w-[120px] flex-col items-end gap-0.5 md:flex">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Team Captain
        </span>
        <span className="text-xs font-medium text-foreground">
          {team.captainName}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-2 rounded-2xl"
        onClick={() => onRequest(team.id)}
        disabled={isPending || spotsLeft <= 0}
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Send className="size-3.5" />
        )}

        {spotsLeft <= 0 ? "Team Full" : "Request to Join"}
      </Button>
    </div>
  );
}
