"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { withErrorHandling } from "@/lib/withErrorHandling";

export async function getCredentialByName(name, userId) {
  return withErrorHandling(
    async () => {
      const { userId: userIdFromAuth } = await auth();
      if (userIdFromAuth) userId = userIdFromAuth;

      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      const credential = await prisma.credential.findUniqueOrThrow({
        where: {
          name_userId: {
            name,
            userId,
          },
        },
      });

      return credential;
    },
    "getCredentialByName",
    "fetch credential"
  );
}
