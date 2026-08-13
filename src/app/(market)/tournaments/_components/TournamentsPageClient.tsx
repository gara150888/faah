"use client"

import { MoreHorizontal, RefreshCw, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select"
import { Spinner } from "~/components/ui/spinner"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import TournamentCard from "./TournamentCard"
import { useSidebar } from "~/components/ui/sidebar"

export type Tournament = {
  id: string
  title: string
  game: string
  image: string
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
  mode: string
  teamSize: number
  regEnd: string
  startDate: string
  teamsCount: number
  maxTeams: number
}

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const mapTournament = (t: any): Tournament => {
  return {
    id: t.id,
    title: t.name,
    game: t.gameName,
    image: t.banner || "bg-gradient-to-r from-purple-600 to-indigo-600",
    status: (t.status === "cancelled" ? "CANCELLED" : t.status.toUpperCase()) as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED",
    mode: t.mode.charAt(0).toUpperCase() + t.mode.slice(1),
    teamSize: t.teamSize,
    regEnd: formatDate(t.registrationEnd),
    startDate: formatDate(t.startDate),
    teamsCount: t.teamsCount ?? 0,
    maxTeams: t.maxTeams,
  };
};

export default function TournamentsPageClient() {
  const getGameLabel = (val: string) => {
    switch (val) {
      case "all": return "All Games";
      case "bgmi": return "BGMI";
      case "freefire": return "Free Fire";
      case "cod": return "COD Mobile";
      default: return val;
    }
  };

  const getModeLabel = (val: string) => {
    switch (val) {
      case "all": return "All Modes";
      case "squad": return "Squad";
      case "duo": return "Duo";
      case "solo": return "Solo";
      default: return val;
    }
  };

  const getSortLabel = (val: string) => {
    switch (val) {
      case "latest": return "Latest First";
      case "oldest": return "Oldest First";
      default: return val;
    }
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [status, setStatus] = useState<"all" | "upcoming" | "ongoing" | "completed" | "cancelled">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const { isMobile } = useSidebar()

  // Debounce search input to avoid querying on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search);
        setPage(1);
        setIsFilterChanging(true);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [search, debouncedSearch]);

  const { data, isLoading, isFetching, isError, refetch } = api.tournament.getAll.useQuery(
    {
      search: debouncedSearch || undefined,
      status: status !== "all" ? status : undefined,
      gameName: selectedGame !== "all" ? selectedGame : undefined,
      mode: selectedMode !== "all" ? (selectedMode as any) : undefined,
      sort: sortOrder,
      page,
      limit: 6,
    },
    {
      placeholderData: (previousData) => previousData,
    }
  );

  useEffect(() => {
    if (!isFetching) {
      setIsFilterChanging(false);
    }
  }, [isFetching]);

  const showFilterLoader = isFilterChanging && isFetching;

  const handleStatusChange = (val: string) => {
    setStatus(val as any);
    setPage(1);
    setIsFilterChanging(true);
  };

  const totalPages = data?.totalPages ?? 1;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tournaments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover and join exciting tournaments. Compete, win, and make your mark!
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tournaments, games..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={selectedGame} onValueChange={(val) => { setSelectedGame(val || "all"); setPage(1); setIsFilterChanging(true); }}>
          <SelectTrigger className="w-35">
            {getGameLabel(selectedGame)}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            <SelectItem value="bgmi">BGMI</SelectItem>
            <SelectItem value="freefire">Free Fire</SelectItem>
            <SelectItem value="cod">COD Mobile</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedMode} onValueChange={(val) => { setSelectedMode(val || "all"); setPage(1); setIsFilterChanging(true); }}>
          <SelectTrigger className="w-35">
            {getModeLabel(selectedMode)}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="squad">Squad</SelectItem>
            <SelectItem value="duo">Duo</SelectItem>
            <SelectItem value="solo">Solo</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={() => refetch()}>
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
        {showFilterLoader && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2 animate-pulse">
            <Spinner className="size-3.5 text-primary" />
            <span>Updating tournaments...</span>
          </div>
        )}
      </div>

      <div className="mb-6 flex md:flex-row gap-3 items-start md:items-center justify-between">
        <Tabs value={status} orientation={isMobile ? "vertical" : undefined} onValueChange={(val) => handleStatusChange(val || "all")}>
          <TabsList variant="line">
            <TabsTrigger value="all">All Tournaments</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={sortOrder} onValueChange={(val) => { setSortOrder((val || "latest") as any); setPage(1); setIsFilterChanging(true); }}>
          <SelectTrigger className="w-35">
            {getSortLabel(sortOrder)}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden animate-pulse h-80">
              <div className="h-40 bg-muted" />
              <div className="flex-1 space-y-4 p-4">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive font-medium">Failed to load tournaments.</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : data?.tournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-card ring-1 ring-foreground/10 rounded-2xl p-8">
          <p className="text-muted-foreground text-sm">No tournaments found matching the filters.</p>
        </div>
      ) : (
        <div className="relative min-h-75">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.tournaments.map((t) => (
              <TournamentCard key={t.id} tournament={mapTournament(t)} />
            ))}
          </div>
        </div>
      )}

      {data && totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) {
                      setPage(page - 1);
                      setIsFilterChanging(true);
                    }
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum, index) => {
                if (pageNum === "ellipsis") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <span className="flex size-9 items-center justify-center text-muted-foreground">
                        <MoreHorizontal className="size-4" />
                      </span>
                    </PaginationItem>
                  );
                }

                const p = pageNum as number;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={page === p}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                        setIsFilterChanging(true);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) {
                      setPage(page + 1);
                      setIsFilterChanging(true);
                    }
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
