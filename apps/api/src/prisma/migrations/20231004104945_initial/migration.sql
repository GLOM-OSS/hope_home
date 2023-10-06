-- CreateTable
CREATE TABLE `Person` (
    `person_id` VARCHAR(36) NOT NULL,
    `fullname` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(15) NULL,
    `whatsapp_number` VARCHAR(15) NULL,
    `profile_image_ref` VARCHAR(199) NULL,
    `gender` ENUM('Male', 'Female') NULL,
    `email` VARCHAR(50) NOT NULL,
    `preferred_lang` ENUM('en', 'fr') NOT NULL DEFAULT 'fr',
    `role` ENUM('ADMIN', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    `password` VARCHAR(75) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Person_email_key`(`email`),
    PRIMARY KEY (`person_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonAudit` (
    `person_audit_id` VARCHAR(36) NOT NULL,
    `fullname` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(15) NULL,
    `whatsapp_number` VARCHAR(15) NULL,
    `profile_image_ref` VARCHAR(45) NULL,
    `gender` ENUM('Male', 'Female') NULL,
    `email` VARCHAR(50) NOT NULL,
    `preferred_lang` ENUM('en', 'fr') NOT NULL,
    `role` ENUM('ADMIN', 'CLIENT') NOT NULL,
    `password` VARCHAR(75) NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `person_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`person_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResetPassword` (
    `reset_password_id` VARCHAR(36) NOT NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `used_at` DATETIME(0) NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `reset_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`reset_password_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Property` (
    `property_id` VARCHAR(36) NOT NULL,
    `image_ref` VARCHAR(255) NULL,
    `price` DOUBLE NOT NULL,
    `area` DOUBLE NULL,
    `listing_reason` ENUM('Rent', 'Sale') NOT NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `description` LONGTEXT NOT NULL,
    `property_type` ENUM('Home', 'Land') NOT NULL,
    `is_listed` BOOLEAN NOT NULL DEFAULT true,
    `is_flagged` BOOLEAN NOT NULL DEFAULT false,
    `address` VARCHAR(191) NOT NULL,
    `number_of_rooms` INTEGER NULL,
    `number_of_baths` INTEGER NULL,
    `house_type` ENUM('Appartment', 'Hostel', 'Villa', 'Room', 'Studio', 'Duplex', 'Default') NULL,
    `owner_whatsapp` VARCHAR(15) NULL,
    `published_by` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    FULLTEXT INDEX `Property_description_idx`(`description`),
    FULLTEXT INDEX `Property_address_description_owner_whatsapp_idx`(`address`, `description`, `owner_whatsapp`),
    PRIMARY KEY (`property_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyAudit` (
    `property_audit_id` VARCHAR(36) NOT NULL,
    `image_ref` VARCHAR(255) NULL,
    `price` DOUBLE NOT NULL,
    `area` DOUBLE NULL,
    `listing_reason` ENUM('Rent', 'Sale') NOT NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `description` LONGTEXT NOT NULL,
    `property_type` ENUM('Home', 'Land') NOT NULL,
    `is_listed` BOOLEAN NOT NULL,
    `is_flagged` BOOLEAN NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `number_of_rooms` INTEGER NULL,
    `number_of_baths` INTEGER NULL,
    `house_type` ENUM('Appartment', 'Hostel', 'Villa', 'Room', 'Studio', 'Duplex', 'Default') NULL,
    `owner_whatsapp` VARCHAR(15) NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`property_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyImage` (
    `property_image_id` VARCHAR(36) NOT NULL,
    `image_ref` VARCHAR(255) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(0) NULL,
    `property_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`property_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlagProperty` (
    `flag_property_id` VARCHAR(36) NOT NULL,
    `flag_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `property_id` VARCHAR(36) NOT NULL,
    `flag_by` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`flag_property_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `comment_id` VARCHAR(36) NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(0) NULL,
    `deleted_by` VARCHAR(36) NULL,
    `commented_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `commented_by` VARCHAR(36) NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LikedProperty` (
    `liked_property_id` VARCHAR(36) NOT NULL,
    `liked_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(0) NULL,
    `liked_by` VARCHAR(36) NOT NULL,
    `property_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `LikedProperty_liked_by_property_id_key`(`liked_by`, `property_id`),
    PRIMARY KEY (`liked_property_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Login` (
    `login_id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(36) NOT NULL,
    `person_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`login_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonAudit` ADD CONSTRAINT `PersonAudit_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_reset_by_fkey` FOREIGN KEY (`reset_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_published_by_fkey` FOREIGN KEY (`published_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAudit` ADD CONSTRAINT `PropertyAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAudit` ADD CONSTRAINT `PropertyAudit_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`property_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyImage` ADD CONSTRAINT `PropertyImage_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`property_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlagProperty` ADD CONSTRAINT `FlagProperty_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`property_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlagProperty` ADD CONSTRAINT `FlagProperty_flag_by_fkey` FOREIGN KEY (`flag_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_commented_by_fkey` FOREIGN KEY (`commented_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`property_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedProperty` ADD CONSTRAINT `LikedProperty_liked_by_fkey` FOREIGN KEY (`liked_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikedProperty` ADD CONSTRAINT `LikedProperty_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `Property`(`property_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;
