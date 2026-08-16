"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type NewTeamSectionProps = {
  control: any;
  errors: any;
};

export default function NewTeamSection({ control, errors }: NewTeamSectionProps) {
  return (
    <div className="space-y-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
      <h4 className="text-sm font-semibold">Create New Team</h4>

      <div className="space-y-2">
        <Label htmlFor="teamName" className="text-xs">
          Team Name
        </Label>

        <Controller
          name="newTeamName"
          control={control}
          render={({ field }) => (
            <Input
              id="teamName"
              {...field}
              placeholder="Enter your team name"
              className="rounded-2xl"
              aria-invalid={!!errors.newTeamName}
            />
          )}
        />

        {errors.newTeamName && (
          <p className="text-xs font-normal text-destructive">
            {errors.newTeamName.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamImage" className="text-xs">
          Team Image
        </Label>

        <Controller
          name="newTeamImage"
          control={control}
          render={({ field }) => (
            <Input
              id="teamImage"
              {...field}
              placeholder="Upload team logo"
              className="rounded-2xl"
            />
          )}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        You will be the captain of this team. You can invite players after
        creating it.
      </p>
    </div>
  );
}
