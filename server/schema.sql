-- Schéma SQL pour MySQL (converti depuis Prisma)

-- -----------------------------------------------------
-- Table `User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) NOT NULL DEFAULT '/assets/avatars/1.png',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Exhibit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Exhibit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `year` VARCHAR(255) NULL,
  `thematic_category` ENUM('PAINTING', 'ARTIFACT', 'HISTORY', 'CULTURE') NOT NULL,
  `chronological_category` ENUM('ANCIENT_ALGERIA', 'ISLAMIC_AND_BERBER_DYNASTIES', 'OTTOMAN_AND_COLONIAL_ALGERIA', 'MODERN_AND_CONTEMPORARY_ALGERIA') NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Model3D`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Model3D` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fileUrl` VARCHAR(255) NOT NULL,
  `exhibitId` INT NOT NULL UNIQUE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_Model3D_Exhibit`
    FOREIGN KEY (`exhibitId`)
    REFERENCES `Exhibit` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Image` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(255) NOT NULL,
  `exhibitId` INT NOT NULL,
  `altText` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_Image_Exhibit`
    FOREIGN KEY (`exhibitId`)
    REFERENCES `Exhibit` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Visit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Visit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `exhibitId` INT NOT NULL,
  `visitedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_user_exhibit_visit` (`userId` ASC, `exhibitId` ASC),
  CONSTRAINT `fk_Visit_User`
    FOREIGN KEY (`userId`)
    REFERENCES `User` (`id`)
    ON DELETE RESTRICT, -- Ou CASCADE si vous voulez que la visite soit supprimée si l'utilisateur est supprimé
  CONSTRAINT `fk_Visit_Exhibit`
    FOREIGN KEY (`exhibitId`)
    REFERENCES `Exhibit` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Favorite`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Favorite` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `exhibitId` INT NOT NULL,
  `addedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_user_exhibit_favorite` (`userId` ASC, `exhibitId` ASC),
  CONSTRAINT `fk_Favorite_User`
    FOREIGN KEY (`userId`)
    REFERENCES `User` (`id`)
    ON DELETE RESTRICT, -- Ou CASCADE
  CONSTRAINT `fk_Favorite_Exhibit`
    FOREIGN KEY (`exhibitId`)
    REFERENCES `Exhibit` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Chat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `startedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` VARCHAR(255) NULL DEFAULT 'Chat with Amuse',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_Chat_User`
    FOREIGN KEY (`userId`)
    REFERENCES `User` (`id`)
    ON DELETE RESTRICT -- Ou CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chatId` INT NOT NULL,
  `sender` ENUM('USER', 'BOT') NOT NULL,
  `content` TEXT NOT NULL,
  `sentAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isVoice` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  INDEX `idx_message_content` (`content`(767)), -- Index sur TEXT, 767 est une longueur de préfixe courante pour utf8mb4
  CONSTRAINT `fk_Message_Chat`
    FOREIGN KEY (`chatId`)
    REFERENCES `Chat` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `RecommendedExhibit` (Table de liaison pour Message <-> Exhibit)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RecommendedExhibit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `messageId` INT NOT NULL,
  `exhibitId` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_RecommendedExhibit_Message`
    FOREIGN KEY (`messageId`)
    REFERENCES `Message` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_RecommendedExhibit_Exhibit`
    FOREIGN KEY (`exhibitId`)
    REFERENCES `Exhibit` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;