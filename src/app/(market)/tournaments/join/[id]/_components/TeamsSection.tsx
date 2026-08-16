"use client";

import { useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import TeamCard from "./TeamCard";
import { Button } from "~/components/ui/button";

const FILTERS = [
  { value: "all", label: "All Status" },
  { value: "registered", label: "Registered" },
  { value: "pending", label: "Pending Approval" },
];

const getStatusLabel = (val: string) => {
  switch (val) {
    case "all": return "All Status";
    case "registered": return "Registered";
    case "pending": return "Pending Approval";
    default: return val;
  }
};

type TeamsSectionProps = {
  tournamentId: string;
  teamSize: number;
};

export default function TeamsSection({
  tournamentId,
  teamSize,
}: TeamsSectionProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: teams = [], isLoading, refetch } =
    api.team.getTournamentTeamsWithDetails.useQuery(
      { tournamentId },
      { refetchOnWindowFocus: false }
    );

  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(teams.length / perPage));
  const paginatedTeams = teams.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Teams ({paginatedTeams.length} / {teams.length})
      </h3>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl pl-9"
          />
        </div>
        <Button disabled={isLoading} onClick={() => refetch()}><RefreshCw className="size-4" /> Reffresh</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card ring-1 ring-foreground/10 p-4">
              <Skeleton className="size-16 rounded-full mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-4" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTeams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              rank={(page - 1) * perPage + index + 1}
              teamSize={teamSize}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
