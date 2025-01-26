"use server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function setupUser() {
  return withErrorHandling(
    async () => {
      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      try {
        await prisma.userBalance.upsert({
          where: {
            userId,
          },
          update: {},
          create: {
            userId,
            credits: 250,
          },
        });
      } catch (error) {
        if (error.code === "P2002") {
          console.warn(
            `Prisma error in setupUser - Unique constraint violation for userId: ${userId}. Another request might have created the record.`
          );
        } else {
          throw error;
        }
      }

      redirect("/workflows");
    },
    "setupUser",
    "setup your account"
  );
}
