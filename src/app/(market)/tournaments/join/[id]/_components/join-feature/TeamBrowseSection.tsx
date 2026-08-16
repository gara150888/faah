"use client";

import { ChevronDown, RefreshCw, Search, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import TeamRow from "./TeamRow";
import CreateTeamPrompt from "./CreateTeamPrompt";

const FILTERS = [
  { value: "all", label: "All Teams" },
  { value: "competitive", label: "Competitive" },
  { value: "casual", label: "Casual" },
] as const;

const teamLabel = (value: string) => FILTERS.find((filter) => filter.value === value)?.label ?? value;

type TeamBrowseSectionProps = {
  tournamentId: string;
  teamSize: number;
};

export default function TeamBrowseSection({ tournamentId, teamSize }: TeamBrowseSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: teams = [], isLoading, refetch } = api.team.getTournamentTeamsWithDetails.useQuery(
    { tournamentId },
    { refetchOnWindowFocus: false }
  );

  const joinMutation = api.team.join.useMutation({
    onSuccess: async () => {
      toast.success("Join request sent successfully!");
      await refetch();
    },
    onError: ({ message }) => {
      toast.error(message || "Failed to send join request");
    },
  });

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const requestToJoin = (teamId: string) =>
    joinMutation.mutate({ teamId, password: "" });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-lg font-semibold">
          Join a Team (Send Join Request)
        </h3>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have a team? You can browse teams and send a join request.
        </p>
      </div>

      {/* Search / Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams by name..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="rounded-2xl pl-9"
          />
        </div>

        <Select value={filter} onValueChange={() => setFilter}>
          <SelectTrigger className="w-40 rounded-2xl">
            <SelectValue placeholder={teamLabel(filter)} />
          </SelectTrigger>

          <SelectContent>
            {FILTERS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="rounded-2xl"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw
            className={cn("size-4", isLoading && "animate-spin")}
          />
        </Button>
      </div>

      {/* Teams */}
      <div className="space-y-0">
        {filteredTeams.map((team) => {
          const spotsLeft = teamSize - team.playerCount;

          return (
            <TeamRow
              key={team.id}
              team={team}
              teamSize={teamSize}
              spotsLeft={spotsLeft}
              isPending={joinMutation.isPending}
              onRequest={requestToJoin}
            />
          );
        })}

        {!filteredTeams.length && !isLoading && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No teams found. Try a different search or create a new team.
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          View more teams <ChevronDown className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-emerald-50/50 p-4 ring-1 ring-emerald-200 dark:bg-emerald-950/20 dark:ring-emerald-800">
        <Shield className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Once your request is sent, the team captain will be notified. You
          will be able to see the status in your requests.
        </p>
      </div>

      <CreateTeamPrompt />
    </div>
  );
}
