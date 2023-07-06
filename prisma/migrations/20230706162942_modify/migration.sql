/*
  Warnings:

  - You are about to drop the column `userId` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_userId_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "userId",
ADD COLUMN     "patientId" TEXT;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
