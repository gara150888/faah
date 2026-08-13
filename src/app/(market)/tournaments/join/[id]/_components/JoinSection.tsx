"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Loader2, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type JoinSectionProps = {
  tournamentId: string;
  userTeams: { id: string; name: string; image: string | null }[];
  userId: string;
};

type JoinType = "existing" | "new" | null;

const joinFormSchema = z.object({
  selectedTeamId: z.string().uuid().optional().or(z.literal("")),
  newTeamName: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name cannot exceed 50 characters"),
  newTeamImage: z.string().url("Invalid team image URL").optional().or(z.literal("")),
});

type JoinFormValues = z.infer<typeof joinFormSchema>;

type JoinTypeCardProps = {
  type: "existing" | "new";
  selected: boolean;
  onSelect: (type: "existing" | "new") => void;
  icon: React.ReactNode;
  title: string;
  description: string;
};

function JoinTypeCard({ type, selected, onSelect, icon, title, description }: JoinTypeCardProps) {
  return (
    <Card
      className={cn("cursor-pointer transition-all", selected ? "ring-2 ring-primary bg-primary/5" : "hover:ring-1 hover:ring-foreground/20")}
      onClick={() => onSelect(type)}
    >
      <CardContent className="flex items-start gap-4 p-5">
        <div className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full", selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={cn("ml-auto mt-1 size-5 rounded-full border-2 flex items-center justify-center", selected ? "border-primary bg-primary" : "border-muted-foreground/30")}>
          {selected && <div className="size-2 rounded-full bg-white" />}
        </div>
      </CardContent>
    </Card>
  );
}

function ExistingTeamSection({
  userTeams,
  selectedTeamId,
  selectedTeam,
  userId,
  control,
}: {
  userTeams: { id: string; name: string; image: string | null }[];
  selectedTeamId: string | undefined;
  selectedTeam: { id: string; name: string; image: string | null } | undefined;
  userId: string;
  control: ReturnType<typeof useForm<JoinFormValues>>["control"];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-1">Select Your Team</h4>
        <p className="text-xs text-muted-foreground">Choose one of your teams to register for this tournament.</p>
      </div>
      <div className="space-y-2">
        <Controller
          name="selectedTeamId"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger className="w-full rounded-2xl">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {userTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {selectedTeam && (
        <div className="space-y-3 pt-2">
          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Team Roster</h5>
          <div className="space-y-2">
            {[
              { id: userId, name: "You (User Name)", role: "captain" as const },
              { id: "p1", name: "Player One", role: "player" as const },
              { id: "p2", name: "Player Two", role: "player" as const },
              { id: "p3", name: "Player Three", role: "player" as const },
            ].map((player) => (
              <PlayerRow key={player.id} player={player} isCurrentUser={player.id === userId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type PlayerRowProps = {
  player: { id: string; name: string; role: "captain" | "player" };
  isCurrentUser: boolean;
};

function PlayerRow({ player, isCurrentUser }: PlayerRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
          player.role === "captain"
            ? "bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300"
            : "bg-muted text-muted-foreground"
        )}
      >
        {player.role === "captain" ? "C" : "P"}
      </div>
      <span className="text-sm text-foreground flex-1">{player.name}</span>
      {player.role === "captain" ? (
        <span className="text-xs text-purple-600 dark:text-purple-300 font-medium">CAPTAIN</span>
      ) : (
        <span className="text-xs text-muted-foreground">Player</span>
      )}
      {isCurrentUser && (
        <span className="text-xs text-emerald-600 dark:text-emerald-300 font-medium">You</span>
      )}
    </div>
  );
}

function NewTeamSection({ control, errors }: { control: ReturnType<typeof useForm<JoinFormValues>>["control"], errors: any }) {
  return (
    <div className="space-y-4 rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
      <h4 className="text-sm font-semibold">Create New Team</h4>
      <div className="space-y-2">
        <Label htmlFor="teamName" className="text-xs">Team Name</Label>
        <Controller
          name="newTeamName"
          control={control}
          render={({ field }) => (
            <Input
              aria-invalid={!!errors.newTeamName}
              id="teamName" {...field} placeholder="Enter your team name" className="rounded-2xl" />
          )}
        />
        {errors.newTeamName && (
          <p className="text-xs font-normal text-destructive">{errors.newTeamName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamImage" className="text-xs">Team Image</Label>
        <Controller
          name="newTeamImage"
          control={control}
          render={({ field }) => (
            <Input id="teamImage" {...field} placeholder="Upload team logo" className="rounded-2xl" />
          )}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        You will be the captain of this team. You can invite players after creating it.
      </p>
    </div>
  );
}

function ConfirmationBar({
  joinType,
  isPending,
  newTeamName,
  onSubmit,
}: {
  joinType: JoinType;
  isPending: boolean;
  newTeamName: string | undefined;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-emerald-50/50 ring-1 ring-emerald-200 dark:bg-emerald-950/20 dark:ring-emerald-800 p-4">
      <div className="flex items-center gap-2">
        <Shield className="size-4 text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm text-emerald-700 dark:text-emerald-300">Your team is ready to join! Please confirm your registration.</p>
      </div>
      <Button
        type="submit"
        disabled={isPending || (joinType === "new" && !newTeamName?.trim())}
        className="rounded-2xl gap-2"
        onClick={onSubmit}
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {joinType === "new" ? "Create Team" : "Join Tournament"}
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}

export default function JoinSection({ tournamentId, userTeams, userId }: JoinSectionProps) {
  const [joinType, setJoinType] = useState<JoinType>(null);
  const router = useRouter();
  const utils = api.useUtils();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema) as any,
    defaultValues: {
      selectedTeamId: "",
      newTeamName: "",
      newTeamImage: "",
    },
    mode: "onBlur",
  });

  const selectedTeamId = watch("selectedTeamId");
  const newTeamName = watch("newTeamName");
  const selectedTeam = userTeams.find((t) => t.id === selectedTeamId);

  const createTeamMutation = api.team.create.useMutation({
    onSuccess: async () => {
      toast.success("Team created successfully!");
      reset({ selectedTeamId: "", newTeamName: "", newTeamImage: "" });
      setJoinType(null);
      await utils.team.invalidate();
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create team");
    },
  });

  const joinTeamMutation = api.team.join.useMutation({
    onSuccess: () => {
      toast.success("Joined tournament successfully!");
      reset({ selectedTeamId: "", newTeamName: "", newTeamImage: "" });
      setJoinType(null);
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to join tournament");
    },
  });

  const handleCreateTeam = async (values: JoinFormValues) => {
    createTeamMutation.mutate({
      tournamentId,
      name: values.newTeamName.trim(),
      image: values.newTeamImage || undefined,
    });
  };

  const handleJoinTournament = async (values: JoinFormValues) => {
    if (!values.selectedTeamId) {
      setError("selectedTeamId", { type: "manual", message: "Please select a team" });
      return;
    }
    joinTeamMutation.mutate({
      teamId: values.selectedTeamId,
      password: "",
    });
  };

  const onSubmitForm = async (values: JoinFormValues) => {
    if (joinType === "new") {
      await handleCreateTeam(values);
    } else if (joinType === "existing") {
      await handleJoinTournament(values);
    }
  };

  const isPending = createTeamMutation.isPending || joinTeamMutation.isPending;

  const handleAccordionValueChange = (values: string[]) => {
    setJoinType(values[0] as JoinType || null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">How do you want to join?</h3>
        <p className="text-sm text-muted-foreground">
          Choose to join with a team you already have or create a new team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JoinTypeCard
          type="existing"
          selected={joinType === "existing"}
          onSelect={setJoinType}
          icon={<Users className="size-5" />}
          title="Join with Existing Team"
          description="Join the tournament using a team you already have."
        />
        <JoinTypeCard
          type="new"
          selected={joinType === "new"}
          onSelect={setJoinType}
          icon={<Shield className="size-5" />}
          title="Create New Team"
          description="Create a new team and invite players to join."
        />
      </div>

      {joinType === "existing" && (
        <ExistingTeamSection
          userTeams={userTeams}
          selectedTeamId={selectedTeamId}
          selectedTeam={selectedTeam}
          userId={userId}
          control={control}
        />
      )}

      {joinType && (
        <ConfirmationBar
          joinType={joinType}
          isPending={isPending}
          newTeamName={newTeamName}
          onSubmit={handleSubmit(onSubmitForm)}
        />
      )}
    </form>
  );
}
