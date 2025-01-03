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

      redirect("/workflows");
    },
    "setupUser",
    "setup your account"
  );
}
