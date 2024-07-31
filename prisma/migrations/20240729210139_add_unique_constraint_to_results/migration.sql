/*
  Warnings:

  - A unique constraint covering the columns `[matchId,participantId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Result_matchId_participantId_key" ON "Result"("matchId", "participantId");
