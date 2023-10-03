/*
  Warnings:

  - You are about to drop the column `user_password` on the `person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Person` DROP COLUMN `user_password`;

-- CreateTable
CREATE TABLE `Login` (
    `login_id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(36) NOT NULL,
    `person_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`login_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;
