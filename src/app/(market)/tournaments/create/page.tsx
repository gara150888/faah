"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { createTournamentSchema, modeRules, type CreateTournamentInput } from "~/schema/tournament.schema";
import { api } from "~/trpc/react";
import { BasicInformationSection } from "./_components/BasicInformationSection";
import { ScheduleSection } from "./_components/ScheduleSection";
import { SettingsSection } from "./_components/SettingsSection";
import { TournamentDetailsSection } from "./_components/TournamentDetailsSection";
import { TournamentPreview } from "./_components/TournamentPreview";

export default function CreateTournamentPage() {
  const router = useRouter();

  const [region, setRegion] = React.useState("India");
  const [prizePool, setPrizePool] = React.useState("10000");
  const [matches, setMatches] = React.useState("24");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTournamentInput>({
    resolver: zodResolver(createTournamentSchema) as any,
    shouldUnregister: true,
    defaultValues: {
      name: "Summer Showdown 2026",
      description: "The ultimate battle for glory!",
      gameName: "BGMI",
      mode: "squad",
      visibility: "public",
      password: "",
      registrationStart: new Date("2026-08-11T10:00"),
      registrationEnd: new Date("2026-08-15T18:00"),
      startDate: new Date("2026-08-16T10:00"),
      endDate: new Date("2026-08-20T18:00"),
      status: "upcoming",
      banner: "",
    },
  });

  const mutation = api.tournament.create.useMutation({
    onSuccess: () => {
      toast.success("Tournament created successfully!");
      router.push("/tournaments");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create tournament");
    },
  });

  const onSubmit = (data: CreateTournamentInput) => {
    const payload = { ...data };
    if (payload.visibility === "public") delete payload.password;
    mutation.mutate(payload);
  };

  const onInvalid = (errors: any) => {
    const errorMsg = Object.keys(errors)
      .map((key) => `${key}: ${errors[key]?.message || "Invalid value"}`)
      .join(", ");
    toast.error(`Please correct form errors: ${errorMsg}`);
  };

  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const watchedGameName = watch("gameName");
  const watchedMode = watch("mode");
  const watchedVisibility = watch("visibility");
  const watchedStatus = watch("status");
  const watchedRegStart = watch("registrationStart");
  const watchedRegEnd = watch("registrationEnd");
  const watchedTournStart = watch("startDate");
  const watchedTournEnd = watch("endDate");
  const watchedBanner = watch("banner");

  const rules = modeRules[watchedMode || "squad"];
  const computedMaxTeams = rules.maxTeams;
  const computedTeamSize = rules.teamSize;
  const computedParticipants = rules.maxPlayers;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Create Tournament</h1>
              <p className="text-sm text-muted-foreground">Fill in the details to create a new tournament.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 pb-8 lg:grid-cols-[1fr_380px]">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
            <BasicInformationSection
              register={register}
              control={control}
              errors={errors}
              watchedName={watchedName}
              watchedDescription={watchedDescription}
              watchedGameName={watchedGameName}
            />
            <ScheduleSection
              register={register}
              errors={errors}
            />
            <TournamentDetailsSection
              computedMaxTeams={computedMaxTeams}
              computedTeamSize={computedTeamSize}
              computedParticipants={computedParticipants}
              watchedMode={watchedMode}
              region={region}
              setRegion={setRegion}
              prizePool={prizePool}
              setPrizePool={setPrizePool}
              matches={matches}
              setMatches={setMatches}
            />
            <SettingsSection
              register={register}
              control={control}
              errors={errors}
              watchedVisibility={watchedVisibility}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-2xl"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/80 flex items-center gap-2"
              >
                {(isSubmitting || mutation.isPending) && (
                  <Spinner className="text-current" />
                )}
                Create Tournament
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <TournamentPreview
              watchedBanner={watchedBanner}
              watchedGameName={watchedGameName}
              watchedName={watchedName}
              watchedStatus={watchedStatus}
              watchedMode={watchedMode}
              region={region}
              watchedDescription={watchedDescription}
              watchedRegStart={watchedRegStart}
              watchedRegEnd={watchedRegEnd}
              watchedTournStart={watchedTournStart}
              watchedTournEnd={watchedTournEnd}
              computedMaxTeams={computedMaxTeams}
              computedTeamSize={computedTeamSize}
              computedParticipants={computedParticipants}
              prizePool={prizePool}
              matches={matches}
              watchedVisibility={watchedVisibility}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
