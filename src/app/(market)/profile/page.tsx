import { getServerSession } from "~/server/auth";
import { api } from "~/trpc/server";
import ProfileClient from "./_components/ProfileClient";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await getServerSession();
  if (!session) return null;

  const profile = await api.profile.getMyProfile();

  if (!profile) return redirect("/profile/edit");

  return <ProfileClient user={session.user} profile={profile} />;
};

export default ProfilePage;
