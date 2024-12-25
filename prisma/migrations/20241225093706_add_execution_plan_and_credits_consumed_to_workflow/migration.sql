-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "executionPlan" TEXT;
