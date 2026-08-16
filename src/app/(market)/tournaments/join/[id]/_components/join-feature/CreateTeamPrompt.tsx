"use client";

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { ArrowRightIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

export default function CreateTeamPrompt() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/10">
      <p className="text-sm text-muted-foreground">
        Ready to compete? Send a request or create a team to get started.
      </p>

      <Button
        className="gap-2 rounded-2xl"
        onClick={() => {
          const accordion = document.querySelector(
            '[data-value="new"]',
          ) as HTMLElement | null;

          accordion?.click();
        }}
      >
        Create New Team <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}
