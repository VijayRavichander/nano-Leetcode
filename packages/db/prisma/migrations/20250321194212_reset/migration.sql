/*
  Warnings:

  - The `sampleTestCase` column on the `ProblemInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `testCases` column on the `ProblemInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `code` on the `DefaultCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `testCases` on the `DefaultCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `metaData` on the `ProblemInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `functionCode` on the `ProblemInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `code` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DefaultCode" DROP COLUMN "code",
ADD COLUMN     "code" JSONB NOT NULL,
DROP COLUMN "testCases",
ADD COLUMN     "testCases" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "ProblemInfo" DROP COLUMN "metaData",
ADD COLUMN     "metaData" JSONB NOT NULL,
DROP COLUMN "functionCode",
ADD COLUMN     "functionCode" JSONB NOT NULL,
DROP COLUMN "sampleTestCase",
ADD COLUMN     "sampleTestCase" JSONB[],
DROP COLUMN "testCases",
ADD COLUMN     "testCases" JSONB[];

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "code",
ADD COLUMN     "code" JSONB NOT NULL;
