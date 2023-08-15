/*
  Warnings:

  - The primary key for the `DayOfWeek` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `DayOfWeek` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `dayOfWeekId` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `muscleGroupId` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `MuscleGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MuscleGroup` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DayOfWeek" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_DayOfWeek" ("id", "name") SELECT "id", "name" FROM "DayOfWeek";
DROP TABLE "DayOfWeek";
ALTER TABLE "new_DayOfWeek" RENAME TO "DayOfWeek";
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
CREATE TABLE "new_MuscleGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_MuscleGroup" ("id", "name") SELECT "id", "name" FROM "MuscleGroup";
DROP TABLE "MuscleGroup";
ALTER TABLE "new_MuscleGroup" RENAME TO "MuscleGroup";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
