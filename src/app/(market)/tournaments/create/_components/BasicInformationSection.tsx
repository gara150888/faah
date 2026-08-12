"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { UploadIcon } from "lucide-react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateTournamentInput } from "~/schema/tournament.schema";

interface BasicInformationSectionProps {
  register: UseFormRegister<CreateTournamentInput>;
  control: Control<CreateTournamentInput>;
  errors: FieldErrors<CreateTournamentInput>;
  watchedName: string | undefined;
  watchedDescription: string | undefined;
  watchedGameName: string | undefined;
}

export function BasicInformationSection({
  register,
  control,
  errors,
  watchedName,
  watchedDescription,
  watchedGameName,
}: BasicInformationSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Tournament Title <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                {...register("name")}
                placeholder="Enter tournament title"
                className="h-9 rounded-2xl"
                aria-invalid={!!errors.name}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {(watchedName || "").length}/100
              </span>
            </div>
            {errors.name && (
              <p className="text-xs font-normal text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Short Description (Optional)</Label>
            <div className="relative">
              <Textarea
                {...register("description")}
                placeholder="Enter short description"
                className="min-h-20 rounded-2xl resize-none"
                aria-invalid={!!errors.description}
              />
              <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                {(watchedDescription || "").length}/500
              </span>
            </div>
            {errors.description && (
              <p className="text-xs font-normal text-destructive">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Game Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                {...register("gameName")}
                placeholder="Enter game name"
                className="h-9 rounded-2xl"
                aria-invalid={!!errors.gameName}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {(watchedGameName || "").length}/100
              </span>
            </div>
            {errors.gameName && (
              <p className="text-xs font-normal text-destructive">{errors.gameName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Banner Image (Optional)</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  {...register("banner")}
                  placeholder="https://example.com/banner.jpg"
                  className="h-9 rounded-2xl"
                  aria-invalid={!!errors.banner}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Recommended: 1200x400px (JPG, PNG)
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" type="button">
                <UploadIcon className="size-4 text-muted-foreground" />
              </Button>
            </div>
            {errors.banner && (
              <p className="text-xs font-normal text-destructive">{errors.banner.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Mode <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="mode"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 w-48 rounded-2xl" aria-invalid={!!errors.mode}>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="duo">Duo</SelectItem>
                  <SelectItem value="squad">Squad</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.mode && (
            <p className="text-xs font-normal text-destructive">{errors.mode.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
