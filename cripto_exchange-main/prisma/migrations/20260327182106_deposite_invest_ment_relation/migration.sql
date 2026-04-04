-- CreateTable
CREATE TABLE `DepositeInvestmentRelation` (
    `id` VARCHAR(191) NOT NULL,
    `depositeId` VARCHAR(191) NOT NULL,
    `investmentId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DepositeInvestmentRelation_depositeId_idx`(`depositeId`),
    INDEX `DepositeInvestmentRelation_investmentId_idx`(`investmentId`),
    UNIQUE INDEX `DepositeInvestmentRelation_depositeId_investmentId_key`(`depositeId`, `investmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DepositeInvestmentRelation` ADD CONSTRAINT `DepositeInvestmentRelation_depositeId_fkey` FOREIGN KEY (`depositeId`) REFERENCES `Deposit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepositeInvestmentRelation` ADD CONSTRAINT `DepositeInvestmentRelation_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
