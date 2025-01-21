-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 21, 2025 at 03:41 PM
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
-- Database: `tweet`
--

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message_text`, `created_at`) VALUES
(1, 1, 35, 'Hello, how are you?', '2024-09-29 17:06:29'),
(2, 1, 35, 'hi ', '2024-09-29 17:10:31'),
(3, 1, 35, 'ho testuser', '2024-09-29 17:12:26'),
(4, 1, 36, 'hi ', '2024-09-29 17:55:32'),
(5, 1, 35, 'good night', '2024-09-29 18:11:48'),
(6, 1, 35, 'cas', '2024-10-29 03:04:04'),
(7, 1, 36, 'Hello Bob!', '2024-10-29 08:34:29'),
(8, 1, 35, '$2b$10$WBbum8ObFSk5DBrMUUQdm.CpNeH.COTo28gNOtb0/nALXEDya.8Ya', '2024-10-29 09:43:07'),
(9, 1, 47, 'hi', '2024-11-01 12:50:52'),
(10, 1, 47, 'hi', '2024-11-01 13:50:21'),
(11, 46, 47, 'hi ', '2024-11-01 13:52:16'),
(12, 45, 47, 'hi', '2024-11-02 05:14:59'),
(13, 1, 35, 'f76ff36c5e5db7e80f9c9417b00e7bb2966b1619f528fde515887aa5de5f53fb', '2024-11-02 05:31:48'),
(14, 46, 1, '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', '2024-11-02 05:39:38'),
(15, 46, 1, '2687360519139cc5a8ced774c35d812d931d1c6680a33fc815154ab66d549026', '2024-11-02 05:43:02'),
(16, 46, 45, '6cf4ae77ae3ce9e96fe0b7090d7c69c43cad04b74894ed224d8de98081b17a61', '2024-11-02 05:43:16'),
(17, 1, 35, 'f76ff36c5e5db7e80f9c9417b00e7bb2966b1619f528fde515887aa5de5f53fb', '2024-11-02 05:47:16'),
(18, 46, 1, '6cf4ae77ae3ce9e96fe0b7090d7c69c43cad04b74894ed224d8de98081b17a61', '2024-11-02 06:02:49'),
(19, 46, 48, 'a3cc598e8eecf0969d3a1023cbd416c6a39641f7ed346f81e6b67a83a76412f9', '2024-11-02 06:39:22'),
(20, 46, 1, 'c42edefc75871e4ce2146fcda67d03dda05cc26fdf93b17b55f42c1eadfdc322', '2024-11-03 08:30:08'),
(21, 46, 47, '688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6', '2024-11-03 14:33:46'),
(22, 49, 47, '33661c24c617fdcc7035f9fe38c90d750e2fd165da1caee30ebd26d46b1f58e8', '2024-11-08 04:31:30'),
(23, 49, 47, '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', '2024-11-08 04:33:09'),
(24, 49, 47, '56f8353fed6f727124285ebe3d0710a5a16894112d2834ed4a2d58f98375ff34', '2024-11-08 05:30:34'),
(25, 46, 36, 'df103b54b5632163114d83b7d24b3f092c5a8eda7e2b79958bf7eb93d14c338a', '2024-11-14 17:36:08'),
(26, 46, 36, '95332f838fb2c85aa297380ca6ef7012f8557a139a597bd316c47b9d7718e80e', '2024-11-14 17:36:22'),
(27, 46, 35, 'df103b54b5632163114d83b7d24b3f092c5a8eda7e2b79958bf7eb93d14c338a', '2024-11-14 17:50:13'),
(28, 46, 35, '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', '2024-11-14 17:50:16'),
(29, 46, 49, '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', '2024-11-15 06:16:41');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('message','like','comment','follow') NOT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `content`, `created_at`, `updated_at`, `count`) VALUES
(2, 46, 'This is my post content.', '2024-11-03 02:48:36', '2024-11-04 16:17:25', 1),
(4, 46, 'hi', '2024-11-03 11:41:07', '2024-11-04 16:41:38', 1),
(5, 47, 'hi innads', '2024-11-03 12:06:58', '2024-11-04 15:13:44', 1),
(6, 49, '22Mis0527', '2024-11-03 12:10:41', '2024-11-15 06:20:37', 2),
(7, 49, '22Mis0527', '2024-11-03 12:40:53', '2024-11-03 12:40:53', 0),
(44, 46, '23Mis0527', '2024-11-03 17:12:25', '2024-11-03 17:12:25', 0),
(45, 46, 'hi im prabakar', '2024-11-04 15:19:22', '2024-11-04 15:19:22', 0),
(46, 47, 'im testusexr', '2024-11-04 15:21:25', '2024-11-14 17:35:03', 1),
(47, 46, 'gfg', '2024-11-04 15:56:20', '2024-11-04 15:56:20', 0),
(49, 47, 'sd', '2024-11-04 16:11:05', '2024-11-14 17:35:04', 1),
(50, 47, 'sfsdfdsf', '2024-11-04 16:14:47', '2024-11-14 17:35:05', 1),
(52, 46, 'software security!!!!!!', '2024-11-14 17:30:06', '2024-11-14 17:30:06', 0),
(53, 46, 'software security!!!!', '2024-11-14 17:31:34', '2024-11-14 17:31:34', 0),
(54, 46, 'Software security!!', '2024-11-14 17:32:41', '2024-11-14 17:32:41', 0),
(55, 46, 'software security', '2024-11-14 17:33:10', '2024-11-14 17:33:10', 0),
(56, 46, 'HI I\'M Software security', '2024-11-14 17:34:27', '2024-11-14 17:34:27', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `failed_attempts` int(11) DEFAULT 0,
  `lock_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `created_at`, `failed_attempts`, `lock_until`) VALUES
(1, 'testuser', 'password', 'youtube12@gmail.com', '2024-09-28 08:06:21', 4, '2024-10-30 14:47:06'),
(35, 'testuser2', 'passwords', 'ppraba07d05@gmail.com', '2024-09-29 08:41:05', 3, '2024-10-29 18:42:44'),
(36, 'testuser3', 'password3', 'pprabaasd0705@gmail.com', '2024-09-29 11:53:29', 0, NULL),
(45, 'testuser1', '$2b$10$n9rePIhyziBRKUuO2VIPuOEhp3/ToOqmOxL48bSyvGHIegsvqaFqe', 'test@example.com', '2024-10-30 07:16:49', 4, '2024-11-03 19:36:09'),
(46, '22mis0543', '$2b$10$7dllE4ORo6U0JA1HpJUlDeryVc6arygwJolgT6twxK2HQhakpXc7G', 'pprabads0705@gmail.com', '2024-11-01 04:53:05', 0, NULL),
(47, 'testusexr', '$2b$10$e/SkGYN/AfEQrXkjrXElxOABwJh366jZOUjoiXEzwcX0ZcLNWdX5S', 'pprabad50705@gmail.com', '2024-11-01 04:57:12', 3, '2024-11-15 13:46:11'),
(48, 'yugendiran', '$2b$10$HKEzVpwvhgYVLoag9QNemuRSusLWyYxUfbSYs3mE1r996JIMVczSi', 'yugendira@gmail.com', '2024-11-02 06:36:10', 0, NULL),
(49, 'praba', '$2b$10$dYtpCnsPOryj86b7sHncQuKanKEMKgULC8HuLEM8Anep6kbeZSDXe', 'prana45@gmail.com', '2024-11-03 11:58:44', 4, '2024-11-15 00:57:38');

-- --------------------------------------------------------

--
-- Table structure for table `user_follows`
--

CREATE TABLE `user_follows` (
  `id` int(11) NOT NULL,
  `follower_username` varchar(255) NOT NULL,
  `following_username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_follows`
--

INSERT INTO `user_follows` (`id`, `follower_username`, `following_username`) VALUES
(76, '22mis0543', 'praba'),
(78, '22mis0543', 'testuser'),
(44, '22mis0543', 'testuser1'),
(43, '22mis0543', 'testuser2'),
(42, '22mis0543', 'testuser3'),
(59, '22mis0543', 'testusexr'),
(66, 'praba', 'testusexr'),
(39, 'testuser', 'testuser3'),
(15, 'testuser2', 'testuser'),
(72, 'testusexr', 'praba'),
(74, 'testusexr', 'testuser'),
(75, 'testusexr', 'testuser1'),
(63, 'yugendiran', '22mis0543'),
(64, 'yugendiran', 'testusexr');

-- --------------------------------------------------------

--
-- Table structure for table `user_likes`
--

CREATE TABLE `user_likes` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_likes`
--

INSERT INTO `user_likes` (`post_id`, `user_id`) VALUES
(2, 47),
(4, 47),
(5, 46),
(6, 46),
(6, 47),
(46, 46),
(49, 46),
(50, 46);

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `followers` int(11) DEFAULT 0,
  `following` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `username`, `bio`, `followers`, `following`, `created_at`, `updated_at`) VALUES
(1, 'testuser', 'ddsf', 3, 1, '2024-09-29 05:01:40', '2024-11-15 06:11:58'),
(2, 'testuser2', 'zcaasdasd', 1, 0, '2024-09-29 08:41:05', '2024-11-01 13:51:45'),
(3, 'testuser3', 'vannakam', 2, 2, '2024-09-29 11:53:29', '2024-11-04 16:44:03'),
(5, 'testuser1', '', 2, 0, '2024-10-30 07:16:49', '2024-11-08 05:25:25'),
(6, '22mis0543', 'i am captain prabhakar', 1, 6, '2024-11-01 04:53:05', '2024-11-15 06:12:55'),
(7, 'testusexr', 'hhfgjnm', 3, 3, '2024-11-01 04:57:12', '2024-11-08 05:30:20'),
(8, 'yugendiran', '', 0, 2, '2024-11-02 06:36:10', '2024-11-08 05:30:20'),
(9, 'praba', '', 2, 1, '2024-11-03 11:58:44', '2024-11-15 06:11:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_follows`
--
ALTER TABLE `user_follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `follower_username` (`follower_username`,`following_username`);

--
-- Indexes for table `user_likes`
--
ALTER TABLE `user_likes`
  ADD PRIMARY KEY (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `user_follows`
--
ALTER TABLE `user_follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_likes`
--
ALTER TABLE `user_likes`
  ADD CONSTRAINT `user_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `user_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
