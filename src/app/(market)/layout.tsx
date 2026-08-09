import SidebarWrapper from "./_components/SidebarWrapper";
import { getServerSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) return redirect("/signin");

  return <SidebarWrapper user={session.user}>{children}</SidebarWrapper>;
}
