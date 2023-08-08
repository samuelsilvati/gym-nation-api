/*
  Warnings:

  - Added the required column `reps` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sets` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sets" TEXT NOT NULL,
    "reps" TEXT NOT NULL,
    "muscleGroupId" INTEGER NOT NULL,
    "dayOfWeekId" INTEGER NOT NULL,
    CONSTRAINT "Exercise_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exercise_dayOfWeekId_fkey" FOREIGN KEY ("dayOfWeekId") REFERENCES "DayOfWeek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("dayOfWeekId", "description", "id", "muscleGroupId", "name") SELECT "dayOfWeekId", "description", "id", "muscleGroupId", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
