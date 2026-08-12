"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateTournamentInput } from "~/schema/tournament.schema";

interface SettingsSectionProps {
  register: UseFormRegister<CreateTournamentInput>;
  control: Control<CreateTournamentInput>;
  errors: FieldErrors<CreateTournamentInput>;
  watchedVisibility: string | undefined;
}

export function SettingsSection({
  register,
  control,
  errors,
  watchedVisibility,
}: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Status <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full rounded-2xl" aria-invalid={!!errors.status}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-xs font-normal text-destructive">{errors.status.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Visibility <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full rounded-2xl" aria-invalid={!!errors.visibility}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.visibility && (
              <p className="text-xs font-normal text-destructive">{errors.visibility.message}</p>
            )}
          </div>
        </div>

        {watchedVisibility === "private" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Enter tournament password"
              className="h-9 rounded-2xl"
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs font-normal text-destructive">{errors.password.message}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
