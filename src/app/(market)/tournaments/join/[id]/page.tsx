import { getServerSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import TournamentHero from "./_components/TournamentHero";
import TournamentSidebar from "./_components/TournamentSidebar";
import TournamentTabs from "./_components/TournamentTabs";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await getServerSession();

  const tournament = await api.tournament.getById({ id });

  if (!tournament) {
    notFound();
  }

  const userTeams = session?.user?.id
    ? await api.team.getMyTeamsByTournamentId({ tournamentId: id })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <TournamentHero tournament={tournament} />
            <TournamentTabs
              tournamentId={id}
              userTeams={userTeams}
              userId={session?.user?.id ?? ""}
            />
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <TournamentSidebar tournament={tournament} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
