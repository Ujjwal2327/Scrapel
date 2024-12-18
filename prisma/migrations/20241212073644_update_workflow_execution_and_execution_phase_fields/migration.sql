-- AlterTable
ALTER TABLE "ExecutionPhase" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WorkflowExecution" ADD COLUMN     "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "trigger" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;
