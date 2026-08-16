"use client";

import { Edit, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

type ProfileClientProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  profile: {
    id: string;
    userId: string;
    name: string;
    bio: string | null;
    avatar: string | null;
    banner: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  };
};

export default function ProfileClient({ user, profile }: ProfileClientProps) {
  const [bannerError, setBannerError] = useState(false);

  const displayName = profile.name ?? user.name ?? "User";
  const bio = profile.bio ?? "";
  const bannerUrl = profile.banner && !bannerError ? profile.banner : undefined;
  const avatarUrl = profile.avatar ?? (user.image ?? undefined);

  return (
    <div className="w-full">
      <div className="relative mb-20">
        <div className="h-48 w-full overflow-hidden rounded-b-2xl bg-linear-to-r from-primary/20 to-primary/10 md:h-64">
          {bannerUrl
            ? <img src={bannerUrl} alt="Banner" className="h-full w-full object-cover" onError={() => setBannerError(true)} />
            : <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="size-8 opacity-40" />
            </div>
          }
        </div>

        <div className="absolute -bottom-12 lg:left-20 left-5">
          <Avatar className="lg:size-40 size-30 border-4 border-background">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="text-2xl">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="absolute -bottom-12 lg:-bottom-12 lg:right-12 right-5">
          <Link href="/profile/edit">
            <Button variant="outline" size="sm" className="gap-2 rounded-2xl">
              <Edit className="size-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
        </div>
        <Separator className="my-4" />
        <Card>
          <CardContent className="p-6">
            <h2 className="text-base font-medium mb-2">Bio</h2>
            {bio
              ? <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bio}</p>
              : <p className="text-sm text-muted-foreground italic">No bio added yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
