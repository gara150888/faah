import { eq } from "drizzle-orm";

import type { UpdateProfileInput } from "~/schema/profile.schema";
import { db } from "~/server/db";
import { profile, user } from "~/server/db/schema";

import { ServiceError } from "./service-error";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class ProfileService {
  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static async getProfile(tx: Transaction, userId: string) {
    const [result] = await tx
      .select()
      .from(profile)
      .where(eq(profile.userId, userId))
      .limit(1);

    return result;
  }

  private static ensureProfileExists(prof: typeof profile.$inferSelect | undefined) {
    if (!prof) {
      throw new ServiceError("Profile not found", "NOT_FOUND");
    }
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  static async getProfileByUserId(userId: string) {
    const result = await db
      .select({
        profile,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(profile)
      .innerJoin(user, eq(profile.userId, user.id))
      .where(eq(profile.userId, userId))
      .limit(1);

    return (result[0] as typeof result[0] | null) ?? null;
  }

  static async getOrCreateProfile(userId: string): Promise<typeof profile.$inferSelect> {
    const [existing] = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId))
      .limit(1);

    if (existing) {
      return existing;
    }

    const [userRecord] = await db
      .select({ name: user.name })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const userName = userRecord?.name ?? "User";

    const [newProfile] = await db
      .insert(profile)
      .values({
        userId,
        name: userName.slice(0, 20),
      })
      .returning();

    if (!newProfile) {
      throw new ServiceError("Failed to create profile", "INTERNAL_SERVER_ERROR");
    }

    return newProfile;
  }

  // ---------------------------------------------------------------------------
  // Update Profile
  // ---------------------------------------------------------------------------

  static async update(userId: string, input: UpdateProfileInput) {
    return db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(profile)
        .where(eq(profile.userId, userId))
        .limit(1);

      if (!existing) {
        const [newProfile] = await tx
          .insert(profile)
          .values({
            userId,
            name: input.name.slice(0, 20),
            bio: input.bio ?? "",
            avatar: input.avatar ?? "",
            banner: input.banner ?? "",
          })
          .returning();

        if (!newProfile) {
          throw new ServiceError("Failed to create profile", "INTERNAL_SERVER_ERROR");
        }

        return newProfile;
      }

      const [updated] = await tx
        .update(profile)
        .set({
          name: input.name.slice(0, 20),
          bio: input.bio ?? "",
          avatar: input.avatar ?? "",
          banner: input.banner ?? "",
        })
        .where(eq(profile.userId, userId))
        .returning();

      if (!updated) {
        throw new ServiceError("Failed to update profile", "INTERNAL_SERVER_ERROR");
      }

      return updated;
    });
  }
}
