import { getServerSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import EditProfileForm from "./_components/EditProfileForm";

const EditProfilePage = async () => {
  const session = await getServerSession();
  if (!session) return redirect("/signin");

  const profile = await api.profile.getMyProfile();

  return <EditProfileForm initialProfile={profile} />;
};

export default EditProfilePage;
