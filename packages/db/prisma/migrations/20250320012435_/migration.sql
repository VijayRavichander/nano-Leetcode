/*
  Warnings:

  - You are about to drop the column `sampletestInputs` on the `ProblemInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProblemInfo" DROP COLUMN "sampletestInputs",
ADD COLUMN     "sampleTestCase" TEXT[];
