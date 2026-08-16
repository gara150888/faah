"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Loader2, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import JoinTypeCard from "./JoinTypeCard";
import NewTeamSection from "./NewTeamSection";
import TeamBrowseSection from "./TeamBrowseSection";

type JoinSectionProps = {
  tournamentId: string;
  teamSize: number;
};

type JoinType = "existing" | "new" | null;

type JoinFormValues = z.infer<typeof joinFormSchema>;

const joinFormSchema = z.object({
  selectedTeamId: z.string().uuid().optional().or(z.literal("")),
  newTeamName: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name cannot exceed 50 characters"),
  newTeamImage: z
    .string()
    .url("Invalid team image URL")
    .optional()
    .or(z.literal("")),
});

export default function JoinSection({
  tournamentId,
  teamSize,
}: JoinSectionProps) {
  const [joinType, setJoinType] = useState<JoinType>(null);

  const router = useRouter();
  const utils = api.useUtils();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema) as any,
    defaultValues: {
      selectedTeamId: "",
      newTeamName: "",
      newTeamImage: "",
    },
    mode: "onBlur",
  });

  const newTeamName = watch("newTeamName");

  const createTeamMutation = api.team.create.useMutation({
    onSuccess: async () => {
      toast.success("Team created successfully!");

      reset({
        selectedTeamId: "",
        newTeamName: "",
        newTeamImage: "",
      });

      setJoinType(null);
      await utils.team.invalidate();
      router.refresh();
    },

    onError: ({ message }) => {
      toast.error(message || "Failed to create team");
    },
  });

  const onSubmit = (values: JoinFormValues) => {
    if (joinType !== "new") return;

    createTeamMutation.mutate({
      tournamentId,
      name: values.newTeamName.trim(),
      image: values.newTeamImage ?? undefined,
    });
  };

  const isPending = createTeamMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-lg font-semibold">
          How do you want to join?
        </h3>

        <p className="text-sm text-muted-foreground">
          Choose to join with a team you already have or create a new team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        <TeamBrowseSection
          tournamentId={tournamentId}
          teamSize={teamSize}
        />
      )}

      {joinType === "new" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <NewTeamSection control={control} errors={errors} />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !newTeamName?.trim()}
              className="gap-2 rounded-2xl"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Create Team
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </form>
      )}

      {!joinType && (
        <div className="flex items-center justify-between rounded-2xl bg-muted/30 p-4 ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">
            Ready to compete? Send a request or create a team to get started.
          </p>

          <Button
            className="gap-2 rounded-2xl"
            onClick={() => setJoinType("new")}
          >
            Create New Team <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
