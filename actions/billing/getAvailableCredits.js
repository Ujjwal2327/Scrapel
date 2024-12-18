"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getAvailableCredits() {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const userBalance = await prisma.userBalance.upsert({
        where: {
          userId,
        },
        update: {},
        create: {
          userId,
        },
      });

      return userBalance.credits;
    },
    "getAvailableCredits",
    "fetch available credits"
  );
}
