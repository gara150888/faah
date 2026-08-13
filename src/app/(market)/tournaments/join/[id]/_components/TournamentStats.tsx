import { Calendar, Gamepad2, Shield, Users } from "lucide-react";
import type { Tournament } from "./types";

type TournamentStatsProps = {
  tournament?: Tournament;
};

export default function TournamentStats({ tournament }: TournamentStatsProps) {
  if (!tournament) return null;

  const modeLabel = tournament.mode.charAt(0).toUpperCase() + tournament.mode.slice(1);

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-card ring-1 ring-foreground/10 px-6 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Gamepad2 className="size-4" />
        <span className="font-medium text-foreground">Game</span>
        <span className="ml-1">{tournament.gameName}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="size-4" />
        <span className="font-medium text-foreground">Mode</span>
        <span className="ml-1">{modeLabel}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" />
        <span className="font-medium text-foreground">Teams</span>
        <span className="ml-1">32 / {tournament.maxTeams}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" />
        <span className="font-medium text-foreground">Players</span>
        <span className="ml-1">128 / {tournament.maxPlayers}</span>
      </div>
    </div>
  );
}
