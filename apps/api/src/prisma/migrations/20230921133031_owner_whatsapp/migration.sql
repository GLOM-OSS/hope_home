-- DropIndex
DROP INDEX `Property_address_description_idx` ON `property`;

-- CreateIndex
CREATE FULLTEXT INDEX `Person_fullname_idx` ON `Person`(`fullname`);

-- CreateIndex
CREATE FULLTEXT INDEX `Property_address_description_owner_whatsapp_idx` ON `Property`(`address`, `description`, `owner_whatsapp`);
