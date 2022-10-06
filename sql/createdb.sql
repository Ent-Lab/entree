-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema entree
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema entree
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `entree` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `entree` ;

-- -----------------------------------------------------
-- Table `entree`.`article`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `entree`.`article` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NOT NULL,
  `thumbnail` VARCHAR(100) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `summary` VARCHAR(100) NOT NULL,
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `entree`.`road_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `entree`.`road_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NOT NULL,
  `node_name` VARCHAR(45) NOT NULL,
  `root_node` VARCHAR(45) NULL DEFAULT NULL,
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE,
  UNIQUE INDEX `node_name_UNIQUE` (`node_name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `entree`.`article_and_road_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `entree`.`article_and_road_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NOT NULL,
  `fk_road_map_code` VARCHAR(45) NOT NULL,
  `fk_article_code` VARCHAR(45) NOT NULL,
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idarticle-road_map_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE,
  INDEX `FK_ARTICLE__ARTICLE_AND_ROAD_MAP` (`fk_article_code` ASC) VISIBLE,
  INDEX `FK_ROAD_MAP__ARTICLE_AND_ROAD_MAP` (`fk_road_map_code` ASC) VISIBLE,
  CONSTRAINT `FK_ARTICLE__ARTICLE_AND_ROAD_MAP`
    FOREIGN KEY (`fk_article_code`)
    REFERENCES `entree`.`article` (`code`),
  CONSTRAINT `FK_ROAD_MAP__ARTICLE_AND_ROAD_MAP`
    FOREIGN KEY (`fk_road_map_code`)
    REFERENCES `entree`.`road_map` (`code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `entree`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `entree`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(100) NULL DEFAULT NULL,
  `login_type` VARCHAR(45) NOT NULL,
  `role` TINYINT NOT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(100) NOT NULL,
  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `entree`.`post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `entree`.`post` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NOT NULL,
  `title` VARCHAR(45) NULL DEFAULT NULL,
  `contents` TEXT NULL DEFAULT NULL,
  `fk_user_code` VARCHAR(45) NULL DEFAULT NULL,
  `created_tiime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE,
  UNIQUE INDEX `fk_user_code_UNIQUE` (`fk_user_code` ASC) VISIBLE,
  CONSTRAINT `FK_USER_POST`
    FOREIGN KEY (`fk_user_code`)
    REFERENCES `entree`.`user` (`code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
