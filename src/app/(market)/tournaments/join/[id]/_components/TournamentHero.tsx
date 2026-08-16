import { Gamepad2, Shield, Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { Tournament } from "./types";

type TournamentHeroProps = {
  tournament?: Tournament;
};

function formatDateTime(date: Date | string | null) {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TournamentHero({ tournament }: TournamentHeroProps) {
  if (!tournament) return null;

  const statusLabel = tournament.status.toUpperCase();
  const modeLabel = tournament.mode.charAt(0).toUpperCase() + tournament.mode.slice(1);

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden">
        {tournament.banner ? (
          <img
            src={tournament.banner}
            alt={tournament.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
            <span className="text-3xl font-bold text-white">
              {tournament.gameName.slice(0, 4).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 pb-6">
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          {tournament.name}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="rounded-full bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300">
            {statusLabel}
          </Badge>
          <Badge variant="default" className="rounded-full bg-black/40 text-white">
            <Users className="mr-1 size-3" />
            {modeLabel}
          </Badge>
          <Badge variant="default" className="rounded-full bg-black/40 text-white">
            Team Size: {tournament.teamSize}
          </Badge>
          <Badge variant="default" className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
            <Shield className="mr-1 size-3" />
            {tournament.visibility.charAt(0).toUpperCase() + tournament.visibility.slice(1)}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {tournament.description || "Join the biggest tournament of the season! Compete with top teams and show your skills to become the champion."}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="size-3.5" />
            <span>Game: {tournament.gameName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5" />
            <span>Mode: {modeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            <span>Teams: {tournament.maxTeams} / 0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            <span>Players: {tournament.maxPlayers} / 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
