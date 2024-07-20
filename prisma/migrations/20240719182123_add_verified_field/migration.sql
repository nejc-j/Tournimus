/*
  Warnings:

  - You are about to drop the column `type` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `eventTime` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfParticipants` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `representative` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `scoringMethod` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationName` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_locationId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "eventTime",
DROP COLUMN "locationId",
DROP COLUMN "logo",
DROP COLUMN "mode",
DROP COLUMN "numberOfParticipants",
DROP COLUMN "representative",
DROP COLUMN "scoringMethod",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "locationName" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- DropTable
DROP TABLE "Location";
