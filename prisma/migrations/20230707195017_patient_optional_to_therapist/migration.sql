-- DropForeignKey
ALTER TABLE "therapist" DROP CONSTRAINT "therapist_patientId_fkey";

-- AlterTable
ALTER TABLE "patient" ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "therapist" ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "therapist" ADD CONSTRAINT "therapist_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
