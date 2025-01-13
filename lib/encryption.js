"use server";
import crypto from "crypto";
import { withErrorHandling } from "./withErrorHandling";

const algorithm = "aes-256-cbc"; // key length must be 32 bytes // openssl rand -hex 32

export async function encrypt(data) {
  const key = process.env.ENCRYPTION_KEY;
  if (!key)
    throw new Error("ENCRYPTION_KEY is missing in environment variables.");

  const iv = crypto.randomBytes(16); // initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export async function decrypt(encrypted) {
  return withErrorHandling(
    async () => {
      const key = process.env.ENCRYPTION_KEY;
      if (key)
        throw new Error("ENCRYPTION_KEY is missing in environment variables.");

      const parts = encrypted.split(":");
      if (parts.length !== 2) throw new Error("Invalid encrypted data format.");

      let [iv, encryptedValue] = parts;
      iv = Buffer.from(iv, "hex");
      encryptedValue = Buffer.from(encryptedValue, "hex");

      const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(key, "hex"),
        iv
      );

      let decrypted = decipher.update(encryptedValue);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    },
    "decrypt",
    "decrypt value"
  );
}
