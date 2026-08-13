"use client";

import { Shield, Users } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type JoinTypeCardsProps = {
  selectedType: "existing" | "new" | null;
  onSelect: (type: "existing" | "new") => void;
  hasExistingTeams: boolean;
};

export default function JoinTypeCards({ selectedType, onSelect, hasExistingTeams }: JoinTypeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        className={cn("cursor-pointer transition-all", selectedType === "existing" ? "ring-2 ring-primary bg-primary/5" : "hover:ring-1 hover:ring-foreground/20")}
        onClick={() => onSelect("existing")}
      >
        <CardContent className="flex items-start gap-4 p-5">
          <div className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full", selectedType === "existing" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
            <Users className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Join with Existing Team</h3>
            <p className="text-xs text-muted-foreground">
              Join the tournament using a team you already have.
            </p>
          </div>
          <div className={cn("ml-auto mt-1 size-5 rounded-full border-2 flex items-center justify-center", selectedType === "existing" ? "border-primary bg-primary" : "border-muted-foreground/30")}>
            {selectedType === "existing" && (
              <div className="size-2 rounded-full bg-white" />
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn("cursor-pointer transition-all", selectedType === "new" ? "ring-2 ring-primary bg-primary/5" : "hover:ring-1 hover:ring-foreground/20")}
        onClick={() => onSelect("new")}
      >
        <CardContent className="flex items-start gap-4 p-5">
          <div className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full", selectedType === "new" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
            <Shield className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Create New Team</h3>
            <p className="text-xs text-muted-foreground">
              Create a new team and invite players to join.
            </p>
          </div>
          <div className={cn("ml-auto mt-1 size-5 rounded-full border-2 flex items-center justify-center", selectedType === "new" ? "border-primary bg-primary" : "border-muted-foreground/30")}>
            {selectedType === "new" && (
              <div className="size-2 rounded-full bg-white" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
