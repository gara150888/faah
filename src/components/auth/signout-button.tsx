"use client";

import { useRouter } from "next/navigation";

import { authClient } from "~/server/auth/client";

export const SignoutButton = ({
  className,
  ...props
}: { className?: string } & React.ComponentProps<"button">) => {
  const router = useRouter();

  const signout = async () =>
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    });

  return <button className={className} onClick={signout} {...props} />;
};
