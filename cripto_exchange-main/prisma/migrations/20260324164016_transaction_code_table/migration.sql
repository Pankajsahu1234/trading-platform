-- CreateTable
CREATE TABLE `TransactionCode` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `transactionCode` VARCHAR(191) NOT NULL,
    `isInvalid` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TransactionCode_userId_key`(`userId`),
    UNIQUE INDEX `TransactionCode_transactionCode_key`(`transactionCode`),
    INDEX `TransactionCode_transactionCode_idx`(`transactionCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TransactionCode` ADD CONSTRAINT `TransactionCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
