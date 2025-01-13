"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { CreditsPacks } from "@/lib/constants";

export async function updateCredits(packId) {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      await prisma.userBalance.upsert({
        where: {
          userId,
        },
        create: {
          userId,
          credits: CreditsPacks[packId].credits,
        },
        update: {
          credits: {
            increment: CreditsPacks[packId].credits,
          },
        },
      });

      revalidatePath("/billing");
    },
    "updateCredits",
    "update credits"
  );
}
