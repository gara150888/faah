"use client";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type TeamCardProps = {
  team: {
    id: string;
    name: string;
    image: string | null;
    playerCount: number;
    captainName: string | null;
  };
  rank: number;
  teamSize: number;
};

export default function TeamCard({ team, rank, teamSize }: TeamCardProps) {
  const extraCount = Math.max(0, team.playerCount - 4);
  const { data: teamPlayers, isLoading } = api.team.getTeamPlayers.useQuery({ teamId: team.id });

  return (
    <div className="flex flex-col rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      <div className="relative flex flex-col items-center p-4 pb-2">
        <div className={cn("absolute top-2 left-2 flex size-6 items-center justify-center rounded-full text-xs font-bold", rank <= 3 ? "bg-yellow-500 text-black" : "bg-gray-600 text-white")}        >
          {rank}
        </div>
        <div className="flex size-16 items-center justify-center">
          {team.image
            ? <img src={team.image} alt={team.name} className="size-full object-contain rounded-md" />
            : <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <span className="text-lg font-bold">
                {team.name.charAt(0).toUpperCase()}
              </span>
            </div>
          }
        </div>
        <h3 className="mt-2 text-sm font-semibold text-center truncate w-full">{team.name}</h3>
      </div>

      <div className="flex flex-col items-center gap-1.5 px-4 pb-4">
        <div className="flex items-center">
          {teamPlayers && teamPlayers?.length > 0 ? teamPlayers?.map((player, i) => (
            <div key={i} className="size-7 overflow-hidden rounded-full border-2 border-card bg-muted -ml-1 first:ml-0">
              {player.image
                ? <img src={player.image} alt="" className="size-full object-cover" />
                : <span className="flex size-full items-center justify-center text-[10px] font-bold">{player.name.charAt(0).toUpperCase()}</span>
              }
            </div>
          )) : <div>Not Found</div>}
          {extraCount > 0 && <span className="ml-1.5 text-xs text-muted-foreground">+{extraCount}</span>}</div>
        <p className="text-xs text-muted-foreground">
          {team.playerCount} / {teamSize} Players
        </p>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">REGISTERED</span>
      </div>
    </div>
  );
}
