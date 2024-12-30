"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserError } from "@/lib/errors";
import { encrypt } from "@/lib/encryption";
import { withErrorHandling } from "@/lib/withErrorHandling";
import { createCredentialSchema } from "@/schemas/credential";

export async function createCredential(form) {
  return withErrorHandling(
    async () => {
      const { success, data } = createCredentialSchema.safeParse(form);
      if (!success)
        throw new UserError("Invalid form data. Please check your inputs.");

      const { userId } = await auth();
      if (!userId)
        throw new UserError("Authentication required. Please log in.");

      data.value = await encrypt(data.value); // encrypt the credential value

      await prisma.credential.create({
        data: {
          userId,
          ...data,
        },
      });

      revalidatePath(`/credentials`);
    },
    "createCredential",
    "create credential"
  );
}
