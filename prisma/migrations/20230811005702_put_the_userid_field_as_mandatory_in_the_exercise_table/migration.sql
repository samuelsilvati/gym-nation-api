/*
  Warnings:

  - Made the column `userId` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sets" TEXT NOT NULL,
    "reps" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "muscleGroupId" INTEGER NOT NULL,
    "dayOfWeekId" INTEGER NOT NULL,
    CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exercise_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exercise_dayOfWeekId_fkey" FOREIGN KEY ("dayOfWeekId") REFERENCES "DayOfWeek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("dayOfWeekId", "description", "id", "muscleGroupId", "name", "reps", "sets", "userId") SELECT "dayOfWeekId", "description", "id", "muscleGroupId", "name", "reps", "sets", "userId" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
