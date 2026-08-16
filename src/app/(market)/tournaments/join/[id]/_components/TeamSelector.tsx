"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type TeamSelectorProps = {
  teams: { id: string; name: string; image: string | null }[];
  selectedTeamId: string | null;
  onSelect: (teamId: string) => void;
};

export default function TeamSelector({ teams, selectedTeamId, onSelect }: TeamSelectorProps) {
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Select Your Team</label>
      <p className="text-xs text-muted-foreground">Choose one of your teams to register for this tournament.</p>
      <Select value={selectedTeamId ?? ""} onValueChange={() => onSelect}>
        <SelectTrigger className="w-full rounded-2xl">
          <SelectValue placeholder="Select a team">
            {selectedTeam && (
              <div className="flex items-center gap-2">
                <span>{selectedTeam.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
