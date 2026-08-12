import { Calendar, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import type { Tournament } from "./TournamentsPageClient"

type TournamentCardProps = {
  tournament: Tournament
}

const statusStyles: Record<string, string> = {
  UPCOMING: "bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300",
  ONGOING: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300",
  COMPLETED: "bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <div className="flex flex-col rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      <div className={`relative h-40 w-full ${tournament.image}`}>
        <Badge
          variant="default"
          className={`absolute left-3 top-3 ${statusStyles[tournament.status] || statusStyles.UPCOMING}`}
        >
          {tournament.status}
        </Badge>
        <Badge variant="default" className="absolute right-3 top-3 bg-black/40 text-white">
          <Users className="mr-1 size-3" />
          {tournament.mode}
        </Badge>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <Avatar size="sm" className="size-6">
            <AvatarFallback className="text-[10px] font-bold">
              {tournament.game.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{tournament.game}</span>
        </div>

        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {tournament.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="size-3.5" />
            <span>{tournament.mode}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-3.5" />
            <span>Team Size: {tournament.teamSize}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            <span>Reg. End</span>
          </div>
          <span className="text-[11px] leading-tight">{tournament.regEnd}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            <span>Start Date</span>
          </div>
          <span className="text-[11px] leading-tight">{tournament.startDate}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          <span>
            {tournament.teamsCount} / {tournament.maxTeams} Teams
          </span>
        </div>

        <div className="mt-auto pt-2">
          <Button variant="outline" size="sm" className="w-full text-xs">
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
