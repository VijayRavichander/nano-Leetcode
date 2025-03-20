/*
  Warnings:

  - You are about to drop the `Problem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DefaultCode" DROP CONSTRAINT "DefaultCode_problemId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemId_fkey";

-- DropIndex
DROP INDEX "DefaultCode_code_key";

-- AlterTable
ALTER TABLE "DefaultCode" ADD COLUMN     "testcaseInputs" TEXT[],
ADD COLUMN     "testcaseOutputs" TEXT[];

-- DropTable
DROP TABLE "Problem";

-- CreateTable
CREATE TABLE "ProblemInfo" (
    "id" TEXT NOT NULL,
    "metaData" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'None',
    "solved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sampletestInputs" TEXT[],
    "sampletestOutputs" TEXT[],
    "functionCode" TEXT NOT NULL,

    CONSTRAINT "ProblemInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemInfo_slug_key" ON "ProblemInfo"("slug");

-- AddForeignKey
ALTER TABLE "DefaultCode" ADD CONSTRAINT "DefaultCode_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "ProblemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "ProblemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
