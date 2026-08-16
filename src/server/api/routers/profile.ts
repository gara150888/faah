import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { updateProfileSchema } from "~/schema/profile.schema";
import { ProfileService } from "~/server/api/services/profile.service";

export const profileRouter = createTRPCRouter({
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    return ProfileService.getOrCreateProfile(ctx.session.user.id);
  }),

  getProfileByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return ProfileService.getProfileByUserId(input.userId);
    }),

  update: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return ProfileService.update(ctx.session.user.id, input);
    }),
});
