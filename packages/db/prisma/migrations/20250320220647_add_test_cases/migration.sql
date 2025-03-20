/*
  Warnings:

  - You are about to drop the column `sampletestOutputs` on the `DefaultCode` table. All the data in the column will be lost.
  - You are about to drop the column `testcaseInputs` on the `DefaultCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DefaultCode" DROP COLUMN "sampletestOutputs",
DROP COLUMN "testcaseInputs",
ADD COLUMN     "testCases" TEXT[];
