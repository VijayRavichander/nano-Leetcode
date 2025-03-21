/*
  Warnings:

  - The `tokens` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "tokens",
ADD COLUMN     "tokens" JSONB[];
