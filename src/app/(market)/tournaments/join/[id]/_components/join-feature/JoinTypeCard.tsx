"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type JoinType = "existing" | "new";

type JoinTypeCardProps = {
  type: Exclude<JoinType, null>;
  selected: boolean;
  onSelect: (type: Exclude<JoinType, null>) => void;
  icon: ReactNode;
  title: string;
  description: string;
};

export default function JoinTypeCard({ type, selected, onSelect, icon, title, description }: JoinTypeCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all",
        selected
          ? "bg-primary/5 ring-2 ring-primary"
          : "hover:ring-1 hover:ring-foreground/20",
      )}
      onClick={() => onSelect(type)}
    >
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className={cn(
            "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full",
            selected
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {icon}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div
          className={cn(
            "ml-auto mt-1 flex size-5 items-center justify-center rounded-full border-2",
            selected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30",
          )}
        >
          {selected && <div className="size-2 rounded-full bg-white" />}
        </div>
      </CardContent>
    </Card>
  );
}
