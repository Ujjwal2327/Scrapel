/*
  Warnings:

  - You are about to drop the column `creditsCost` on the `ExecutionPhase` table. All the data in the column will be lost.
  - The `status` column on the `ExecutionPhase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `trigger` column on the `WorkflowExecution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `WorkflowExecution` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WorkflowExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "WorkflowExecutionTrigger" AS ENUM ('MANUAL');

-- CreateEnum
CREATE TYPE "ExecutionPhaseStatus" AS ENUM ('CREATED', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "ExecutionPhase" DROP COLUMN "creditsCost",
ADD COLUMN     "creditsConsumed" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "ExecutionPhaseStatus" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "WorkflowExecution" DROP COLUMN "trigger",
ADD COLUMN     "trigger" "WorkflowExecutionTrigger" NOT NULL DEFAULT 'MANUAL',
DROP COLUMN "status",
ADD COLUMN     "status" "WorkflowExecutionStatus" NOT NULL DEFAULT 'PENDING';
