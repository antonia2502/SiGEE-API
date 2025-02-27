-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26/02/2025 às 21:41
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sigee`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `consumo`
--

CREATE TABLE `consumo` (
  `id` int(11) NOT NULL,
  `unidade_id` int(11) NOT NULL,
  `data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `consumo_kwh` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `consumo`
--

INSERT INTO `consumo` (`id`, `unidade_id`, `data_registro`, `consumo_kwh`) VALUES
(1, 2, '2025-02-18 03:00:00', 120.10),
(2, 2, '2025-02-18 03:00:00', 120.00),
(3, 2, '2025-02-18 03:00:00', 1201.00),
(4, 2, '2025-02-25 03:00:00', 130.00),
(5, 7, '2025-02-24 03:00:00', 2000.00),
(6, 7, '2025-02-25 03:00:00', 2500.00),
(7, 7, '2025-02-26 03:00:00', 2400.00),
(8, 7, '2025-02-27 03:00:00', 2200.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `unidades_consumidoras`
--

CREATE TABLE `unidades_consumidoras` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cep` varchar(10) NOT NULL,
  `estado` varchar(2) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `bairro` varchar(100) NOT NULL,
  `logradouro` varchar(200) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `complemento` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `unidades_consumidoras`
--

INSERT INTO `unidades_consumidoras` (`id`, `usuario_id`, `nome`, `cep`, `estado`, `cidade`, `bairro`, `logradouro`, `numero`, `complemento`) VALUES
(2, 1, 'Casa Centro', '', '', '', '', '', '', NULL),
(5, 1, 'Minha Casa', '68.000-001', 'PA', 'Santarém', 'Comunidade São José', 'Ramal 20', '25', 'Trevo do Mojuí, Br 163'),
(7, 3, 'Casa Mapiri', '68000-000', 'PA', 'Santarém', 'Mapiri', 'Rua Raimundo Fona', '121', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `data_nasc` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `data_nasc`) VALUES
(1, 'Paulinho', 'paulinho@email.com', '$2b$10$3/yb8eocu848NTb5oPAY4uPRklFTUOg8aG1O5Ku7ZX0lutiZUwFs.', NULL),
(2, 'Tita', 'tita@email.com', '$2b$10$fSbQUedhzJHwQng/tWNTU.CITjQJCxOPsFDaOha7fCopmKric2vU2', NULL),
(3, 'Lúcia Helena', 'lucia@email.com', '$2b$10$I3lR39jwRCNTTed2lCC4HONxLxvNmWC8p6Y4gxAAOfILEtIiSotAS', '2021-07-18');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `consumo`
--
ALTER TABLE `consumo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unidade_id` (`unidade_id`);

--
-- Índices de tabela `unidades_consumidoras`
--
ALTER TABLE `unidades_consumidoras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `consumo`
--
ALTER TABLE `consumo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `unidades_consumidoras`
--
ALTER TABLE `unidades_consumidoras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `consumo`
--
ALTER TABLE `consumo`
  ADD CONSTRAINT `consumo_ibfk_1` FOREIGN KEY (`unidade_id`) REFERENCES `unidades_consumidoras` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `unidades_consumidoras`
--
ALTER TABLE `unidades_consumidoras`
  ADD CONSTRAINT `unidades_consumidoras_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
