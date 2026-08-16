import { Calendar, Gamepad2, Shield, Users } from "lucide-react";
import type { Tournament } from "./types";

type TournamentStatsProps = {
  tournament?: Tournament;
};

export default function TournamentStats({ tournament }: TournamentStatsProps) {
  if (!tournament) return null;

  const modeLabel = tournament.mode.charAt(0).toUpperCase() + tournament.mode.slice(1);

  const stats = [
    { label: "Game", value: tournament.gameName, icon: Gamepad2 },
    { label: "Mode", value: modeLabel, icon: Shield },
    { label: "Teams", value: `${tournament.maxTeams} / ${tournament.maxTeams}`, icon: Users },
    { label: "Players", value: `${tournament.maxPlayers} / ${tournament.maxPlayers}`, icon: Users },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-card ring-1 ring-foreground/10 px-6 py-4">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-2 text-sm text-muted-foreground">
          <stat.icon className="size-4" />
          <span className="font-medium text-foreground">{stat.label}</span>
          <span className="ml-1">{stat.value}</span>
          {i < stats.length - 1 && <div className="h-4 w-px bg-border" />}
        </div>
      ))}
    </div>
  );
}
