/*
  Warnings:

  - You are about to alter the column `owner_whatsapp` on the `property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `owner_whatsapp` on the `propertyaudit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE `property` MODIFY `owner_whatsapp` VARCHAR(15) NULL;

-- AlterTable
ALTER TABLE `propertyaudit` MODIFY `owner_whatsapp` VARCHAR(15) NULL;
