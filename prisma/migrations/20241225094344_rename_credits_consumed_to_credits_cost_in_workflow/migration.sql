/*
  Warnings:

  - You are about to drop the column `creditsConsumed` on the `Workflow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "creditsConsumed",
ADD COLUMN     "creditsCost" INTEGER NOT NULL DEFAULT 0;
