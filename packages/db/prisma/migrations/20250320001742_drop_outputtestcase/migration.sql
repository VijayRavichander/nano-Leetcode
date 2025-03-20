/*
  Warnings:

  - You are about to drop the column `sampletestOutputs` on the `ProblemInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DefaultCode" ADD COLUMN     "sampletestOutputs" TEXT[];

-- AlterTable
ALTER TABLE "ProblemInfo" DROP COLUMN "sampletestOutputs";
