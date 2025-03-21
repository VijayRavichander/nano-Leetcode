/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_submissionId_fkey";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "TestCase";
