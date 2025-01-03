"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { CreditsPacks } from "@/lib/constants";

// 20000 upper limit
export async function purchaseCredits(packId) {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const currentBalance = await prisma.userBalance.findUniqueOrThrow({
        where: {
          userId,
        },
        select: {
          credits: true,
        },
      });

      if (currentBalance.credits + CreditsPacks[packId].credits > 20000)
        throw new UserError("Credit balance cannot exceed 20,000.");

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
    "purchaseCredits",
    "purchase credits"
  );
}
