-- GearGuard Maintenance Management System
-- MySQL Database Schema
-- Generated from Sequelize models

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS `request_history`;
DROP TABLE IF EXISTS `maintenance_requests`;
DROP TABLE IF EXISTS `equipment`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `equipment_categories`;
DROP TABLE IF EXISTS `maintenance_teams`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `users`;

-- ============================================
-- Table: users
-- Purpose: User accounts and authentication
-- ============================================
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NULL,
    `google_id` VARCHAR(255) NULL UNIQUE,
    `auth_provider` ENUM('local', 'google') NOT NULL DEFAULT 'local',
    `profile_picture` VARCHAR(500) NULL,
    `role` ENUM('admin', 'manager', 'technician', 'user') NOT NULL DEFAULT 'user',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_email` (`email`),
    INDEX `idx_google_id` (`google_id`),
    INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: departments
-- Purpose: Company departments/organizational units
-- ============================================
CREATE TABLE `departments` (
    `department_id` INT AUTO_INCREMENT PRIMARY KEY,
    `department_name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX `idx_department_name` (`department_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: maintenance_teams
-- Purpose: Maintenance teams (groups of technicians)
-- ============================================
CREATE TABLE `maintenance_teams` (
    `team_id` INT AUTO_INCREMENT PRIMARY KEY,
    `team_name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_team_name` (`team_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: team_members
-- Purpose: Junction table for User ↔ Team (many-to-many)
-- ============================================
CREATE TABLE `team_members` (
    `team_member_id` INT AUTO_INCREMENT PRIMARY KEY,
    `team_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `is_lead` BOOLEAN NOT NULL DEFAULT FALSE,
    `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY `unique_team_user` (`team_id`, `user_id`),
    FOREIGN KEY (`team_id`) REFERENCES `maintenance_teams`(`team_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    INDEX `idx_team_id` (`team_id`),
    INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: equipment_categories
-- Purpose: Equipment classifications/types
-- ============================================
CREATE TABLE `equipment_categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX `idx_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: equipment
-- Purpose: Company assets/machines that need maintenance
-- ============================================
CREATE TABLE `equipment` (
    `equipment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_name` VARCHAR(255) NOT NULL,
    `serial_number` VARCHAR(255) NOT NULL UNIQUE,
    `category_id` INT NOT NULL,
    `department_id` INT NULL,
    `assigned_to_user_id` INT NULL,
    `maintenance_team_id` INT NOT NULL,
    `default_technician_id` INT NULL,
    `purchase_date` DATE NULL,
    `warranty_expiry_date` DATE NULL,
    `location` VARCHAR(500) NULL,
    `status` ENUM('active', 'under_maintenance', 'scrapped') NOT NULL DEFAULT 'active',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`category_id`) REFERENCES `equipment_categories`(`category_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE SET NULL,
    FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL,
    FOREIGN KEY (`maintenance_team_id`) REFERENCES `maintenance_teams`(`team_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`default_technician_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL,
    INDEX `idx_serial_number` (`serial_number`),
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_department_id` (`department_id`),
    INDEX `idx_maintenance_team_id` (`maintenance_team_id`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: maintenance_requests
-- Purpose: Maintenance work orders/requests
-- ============================================
CREATE TABLE `maintenance_requests` (
    `request_id` INT AUTO_INCREMENT PRIMARY KEY,
    `subject` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `equipment_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `maintenance_team_id` INT NOT NULL,
    `request_type` ENUM('corrective', 'preventive') NOT NULL,
    `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    `stage` ENUM('new', 'in_progress', 'repaired', 'scrapped') NOT NULL DEFAULT 'new',
    `created_by_user_id` INT NOT NULL,
    `assigned_to_user_id` INT NULL,
    `scheduled_date` DATETIME NULL,
    `completed_date` DATETIME NULL,
    `duration_hours` DECIMAL(5,2) NULL,
    `notes` TEXT NULL,
    `is_overdue` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`category_id`) REFERENCES `equipment_categories`(`category_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`maintenance_team_id`) REFERENCES `maintenance_teams`(`team_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL,
    INDEX `idx_equipment_id` (`equipment_id`),
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_maintenance_team_id` (`maintenance_team_id`),
    INDEX `idx_created_by_user_id` (`created_by_user_id`),
    INDEX `idx_assigned_to_user_id` (`assigned_to_user_id`),
    INDEX `idx_stage` (`stage`),
    INDEX `idx_priority` (`priority`),
    INDEX `idx_is_overdue` (`is_overdue`),
    INDEX `idx_scheduled_date` (`scheduled_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: request_history
-- Purpose: Audit trail for request changes
-- ============================================
CREATE TABLE `request_history` (
    `history_id` INT AUTO_INCREMENT PRIMARY KEY,
    `request_id` INT NOT NULL,
    `changed_by_user_id` INT NOT NULL,
    `field_changed` VARCHAR(100) NULL,
    `old_value` TEXT NULL,
    `new_value` TEXT NULL,
    `changed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`request_id`) REFERENCES `maintenance_requests`(`request_id`) ON DELETE CASCADE,
    FOREIGN KEY (`changed_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT,
    INDEX `idx_request_id` (`request_id`),
    INDEX `idx_changed_by_user_id` (`changed_by_user_id`),
    INDEX `idx_changed_at` (`changed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- End of Schema
-- ============================================

