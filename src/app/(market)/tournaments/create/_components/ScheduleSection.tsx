"use client";

import React from "react";
import { InputGroup, InputGroupInput } from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateTournamentInput } from "~/schema/tournament.schema";

interface ScheduleSectionProps {
  register: UseFormRegister<CreateTournamentInput>;
  errors: FieldErrors<CreateTournamentInput>;
}

export function ScheduleSection({
  register,
  errors,
}: ScheduleSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Registration Start <span className="text-destructive">*</span>
            </Label>
            <InputGroup>
              <InputGroupInput
                type="datetime-local"
                {...register("registrationStart")}
                aria-invalid={!!errors.registrationStart}
              />
            </InputGroup>
            {errors.registrationStart && (
              <p className="text-xs font-normal text-destructive">{errors.registrationStart.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Registration End <span className="text-destructive">*</span>
            </Label>
            <InputGroup>
              <InputGroupInput
                type="datetime-local"
                {...register("registrationEnd")}
                aria-invalid={!!errors.registrationEnd}
              />
            </InputGroup>
            {errors.registrationEnd && (
              <p className="text-xs font-normal text-destructive">{errors.registrationEnd.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Tournament Start Date <span className="text-destructive">*</span>
            </Label>
            <InputGroup>
              <InputGroupInput
                type="datetime-local"
                {...register("startDate")}
                aria-invalid={!!errors.startDate}
              />
            </InputGroup>
            {errors.startDate && (
              <p className="text-xs font-normal text-destructive">{errors.startDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Tournament End Date <span className="text-destructive">*</span>
            </Label>
            <InputGroup>
              <InputGroupInput
                type="datetime-local"
                {...register("endDate")}
                aria-invalid={!!errors.endDate}
              />
            </InputGroup>
            {errors.endDate && (
              <p className="text-xs font-normal text-destructive">{errors.endDate.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
