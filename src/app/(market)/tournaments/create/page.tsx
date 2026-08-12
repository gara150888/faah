"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClockIcon, EyeIcon, Gamepad2Icon, MapPinIcon, ShieldIcon, TrophyIcon, UploadIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { InputGroup, InputGroupInput } from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { createTournamentSchema, modeRules, type CreateTournamentInput } from "~/schema/tournament.schema";
import { api } from "~/trpc/react";
import { z } from "zod";

function formatDateTime(dateTime?: string | Date) {
  if (!dateTime) return "N/A";
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

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
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create tournament");
    },
  });

  const onSubmit = (data: CreateTournamentInput) => {
    const payload = { ...data };
    if (payload.visibility === "public") {
      delete payload.password;
    }
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

  const rules = modeRules[watchedMode] || modeRules.squad;
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

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Tournament Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Max Teams <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={computedMaxTeams}
                      disabled
                      className="h-9 rounded-2xl bg-muted/30 cursor-not-allowed text-muted-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground">Locked to mode: {watchedMode}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Team Size <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={computedTeamSize}
                      disabled
                      className="h-9 rounded-2xl bg-muted/30 cursor-not-allowed text-muted-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground">Locked to mode: {watchedMode}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Region <span className="text-destructive">*</span>
                    </Label>
                    <Select value={region} onValueChange={(v) => v && setRegion(v)}>
                      <SelectTrigger className="h-9 w-full rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Prize Pool (₹) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={prizePool}
                      onChange={(e) => setPrizePool(e.target.value)}
                      className="h-9 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Matches <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={matches}
                      onChange={(e) => setMatches(e.target.value)}
                      className="h-9 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Participants <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={computedParticipants}
                      disabled
                      className="h-9 rounded-2xl bg-muted/30 cursor-not-allowed text-muted-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground">Locked to mode: {watchedMode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-medium">Tournament Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-muted">
                  {watchedBanner ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={watchedBanner}
                      alt="Tournament Banner"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {watchedGameName ? watchedGameName.slice(0, 4).toUpperCase() : "BANNER"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{watchedName || "Tournament Title"}</h3>
                  <Badge
                    variant={
                      watchedStatus === "upcoming"
                        ? "default"
                        : watchedStatus === "ongoing"
                          ? "secondary"
                          : "outline"
                    }
                    className="rounded-full capitalize"
                  >
                    {watchedStatus}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Gamepad2Icon className="size-4" />
                    <span>{watchedGameName || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldIcon className="size-4" />
                    <span className="capitalize">{watchedMode || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon className="size-4" />
                    <span>{region}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {watchedDescription || "No description provided."}
                </p>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ClockIcon className="size-4" />
                      <span>Registration</span>
                    </div>
                    <span className="text-foreground text-right text-xs">
                      {formatDateTime(watchedRegStart)} - {formatDateTime(watchedRegEnd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrophyIcon className="size-4" />
                      <span>Tournament</span>
                    </div>
                    <span className="text-foreground text-right text-xs">
                      {formatDateTime(watchedTournStart)} - {formatDateTime(watchedTournEnd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UsersIcon className="size-4" />
                      <span>Max Teams</span>
                    </div>
                    <span className="text-foreground">{computedMaxTeams} Teams</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UsersIcon className="size-4" />
                      <span>Team Size</span>
                    </div>
                    <span className="text-foreground">{computedTeamSize} Players</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrophyIcon className="size-4" />
                      <span>Prize Pool</span>
                    </div>
                    <span className="text-foreground">₹{Number(prizePool).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Gamepad2Icon className="size-4" />
                      <span>Matches</span>
                    </div>
                    <span className="text-foreground">{matches}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UsersIcon className="size-4" />
                      <span>Participants</span>
                    </div>
                    <span className="text-foreground">{computedParticipants}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldIcon className="size-4" />
                    <span>Status</span>
                  </div>
                  <Badge
                    variant={
                      watchedStatus === "upcoming"
                        ? "default"
                        : watchedStatus === "ongoing"
                          ? "secondary"
                          : "outline"
                    }
                    className="rounded-full capitalize"
                  >
                    {watchedStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <EyeIcon className="size-4" />
                    <span>Visibility</span>
                  </div>
                  <Badge variant="outline" className="rounded-full capitalize">
                    {watchedVisibility}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="flex items-start gap-3 pt-4 pb-4">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <span className="text-xs font-bold">i</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Once created, you can edit these details anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

