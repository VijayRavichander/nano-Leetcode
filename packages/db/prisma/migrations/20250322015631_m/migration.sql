/*
  Warnings:

  - Changed the type of `code` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "code",
ADD COLUMN     "code" JSONB NOT NULL;
