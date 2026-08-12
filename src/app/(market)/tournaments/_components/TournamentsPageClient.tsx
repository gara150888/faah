"use client"

import { useState } from "react"
import { Search, RefreshCw, Bell, ChevronDown, Calendar, Users, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import TournamentCard from "./TournamentCard"

export type Tournament = {
  id: string
  title: string
  game: string
  image: string
  status: "UPCOMING" | "ONGOING" | "COMPLETED"
  mode: string
  teamSize: number
  regEnd: string
  startDate: string
  teamsCount: number
  maxTeams: number
}


const tournaments: Tournament[] = [
  {
    id: "1",
    title: "BGMI Pro League Season 1",
    game: "BGMI",
    image: "bg-[#1a1a2e]",
    status: "UPCOMING",
    mode: "Squad",
    teamSize: 4,
    regEnd: "15 May 2025, 11:59 PM",
    startDate: "18 May 2025, 06:00 PM",
    teamsCount: 32,
    maxTeams: 64,
  },
  {
    id: "2",
    title: "Free Fire Duel Cup",
    game: "Free Fire",
    image: "bg-gradient-to-r from-purple-600 to-indigo-600",
    status: "UPCOMING",
    mode: "Duo",
    teamSize: 2,
    regEnd: "12 May 2025, 11:59 PM",
    startDate: "15 May 2025, 05:00 PM",
    teamsCount: 24,
    maxTeams: 48,
  },
  {
    id: "3",
    title: "COD Mobile Championship",
    game: "COD Mobile",
    image: "bg-[#2d2d2d]",
    status: "ONGOING",
    mode: "Squad",
    teamSize: 5,
    regEnd: "05 May 2025, 11:59 PM",
    startDate: "08 May 2025, 06:00 PM",
    teamsCount: 40,
    maxTeams: 64,
  },
  {
    id: "4",
    title: "Valorant Clash Series",
    game: "Valorant",
    image: "bg-gradient-to-r from-red-900 to-black",
    status: "UPCOMING",
    mode: "5v5",
    teamSize: 5,
    regEnd: "20 May 2025, 11:59 PM",
    startDate: "22 May 2025, 07:00 PM",
    teamsCount: 16,
    maxTeams: 32,
  },
  {
    id: "5",
    title: "PUBG Solo Showdown",
    game: "PUBG PC",
    image: "bg-gradient-to-r from-yellow-600 to-orange-700",
    status: "UPCOMING",
    mode: "Solo",
    teamSize: 1,
    regEnd: "17 May 2025, 11:59 PM",
    startDate: "19 May 2025, 08:00 PM",
    teamsCount: 50,
    maxTeams: 100,
  },
  {
    id: "6",
    title: "Apex Legends Arena",
    game: "Apex Legends",
    image: "bg-[#1a1a1a]",
    status: "COMPLETED",
    mode: "Squad",
    teamSize: 3,
    regEnd: "02 May 2025, 11:59 PM",
    startDate: "04 May 2025, 06:00 PM",
    teamsCount: 64,
    maxTeams: 64,
  },
]

export default function TournamentsPageClient() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredTournaments = activeTab === "all"
    ? tournaments
    : tournaments.filter((t) => t.status.toLowerCase() === activeTab)

  return (
    <div className="w-full px-4">
      {/* <div className="mx-auto max-w-7xl px-4 py-8"> */}
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
          />
        </div>
        <Select>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            <SelectItem value="bgmi">BGMI</SelectItem>
            <SelectItem value="freefire">Free Fire</SelectItem>
            <SelectItem value="cod">COD Mobile</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="All Modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="squad">Squad</SelectItem>
            <SelectItem value="duo">Duo</SelectItem>
            <SelectItem value="solo">Solo</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="default">
            <TabsTrigger value="all">All Tournaments</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Latest First" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationPrevious href="#" />
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <span className="flex size-9 items-center justify-center text-muted-foreground">
                <MoreHorizontal className="size-4" />
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationNext href="#" />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
