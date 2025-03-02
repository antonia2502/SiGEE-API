-- MySQL Script generated by MySQL Workbench
-- Wed Feb 26 17:43:46 2025
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `mydb`.`usuarios` (
  `id` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NULL,
  `senha` VARCHAR(45) NOT NULL,
  `data_nasc` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`unidades_consumidoras`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`unidades_consumidoras` ;

CREATE TABLE IF NOT EXISTS `mydb`.`unidades_consumidoras` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `cep` VARCHAR(10) NOT NULL,
  `estado` VARCHAR(2) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `bairro` VARCHAR(100) NOT NULL,
  `logradouro` VARCHAR(200) NOT NULL,
  `numero` VARCHAR(10) NOT NULL,
  `complemento` VARCHAR(200) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_uc_Usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_uc_Usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `mydb`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`consumo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`consumo` ;

CREATE TABLE IF NOT EXISTS `mydb`.`consumo` (
  `id` INT NOT NULL,
  `data_registro` DATETIME NOT NULL,
  `consumo_kwh` DECIMAL(10,2) NOT NULL,
  `uc_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Registro_consumo_uc1_idx` (`uc_id` ASC) VISIBLE,
  CONSTRAINT `fk_Registro_consumo_uc1`
    FOREIGN KEY (`uc_id`)
    REFERENCES `mydb`.`unidades_consumidoras` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
