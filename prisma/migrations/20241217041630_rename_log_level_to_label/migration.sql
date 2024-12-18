/*
  Warnings:

  - You are about to drop the column `logLevel` on the `ExecutionLog` table. All the data in the column will be lost.
  - Added the required column `label` to the `ExecutionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExecutionLog" DROP COLUMN "logLevel",
ADD COLUMN     "label" TEXT NOT NULL;
