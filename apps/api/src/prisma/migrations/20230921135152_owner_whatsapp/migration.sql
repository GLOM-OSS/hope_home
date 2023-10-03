-- DropIndex
DROP INDEX `Property_address_description_owner_whatsapp_idx` ON `property`;

-- CreateIndex
CREATE FULLTEXT INDEX `Property_address_description_idx` ON `Property`(`address`, `description`);
