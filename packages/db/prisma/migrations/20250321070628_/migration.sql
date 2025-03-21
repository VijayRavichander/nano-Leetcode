/*
  Warnings:

  - Changed the type of `tokens` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "tokens",
ADD COLUMN     "tokens" JSONB NOT NULL;
