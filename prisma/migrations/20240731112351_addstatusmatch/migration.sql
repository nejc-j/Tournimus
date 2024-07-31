-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'FINISHED');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "pointsCalculated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'UPCOMING';
