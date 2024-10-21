-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2024 at 06:43 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sneaker_street`
--

-- --------------------------------------------------------

--
-- Table structure for table `catalogo`
--

CREATE TABLE `catalogo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `url_imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catalogo`
--

INSERT INTO `catalogo` (`id`, `nombre`, `descripcion`, `precio`, `url_imagen`) VALUES
(1, 'Clogposite', 'Sand Drift and Black', 120.00, 'https://acortar.link/wJSyMb'),
(2, 'Air Jordan 1 Low OG', 'Gym Red & Midnight Navy', 150.00, 'https://acortar.link/QkH1Gb'),
(3, 'Air Terra Humara', 'Hemp and Sesame', 135.00, 'https://acortar.link/GUvUN0'),
(4, 'LD-1000', 'Vintage Green and Bicoastal', 145.00, 'https://acortar.link/MTdNCH'),
(5, 'Nike SB Dunk Low Pro', 'Celestial Gold and Dark Team Red', 200.00, 'https://acortar.link/r5CBAs'),
(6, 'Nike SB Zoom Blazer Low', 'Black and Metalic Silver', 185.00, 'https://acortar.link/D1w3o4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `catalogo`
--
ALTER TABLE `catalogo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `catalogo`
--
ALTER TABLE `catalogo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
