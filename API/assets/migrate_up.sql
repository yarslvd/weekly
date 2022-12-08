CREATE DATABASE IF NOT EXISTS chronos_api;
CREATE USER IF NOT EXISTS 'chronos_admin'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON chronos_api.* TO 'chronos_admin'@'localhost';

USE chronos_api;

CREATE TABLE IF NOT EXISTS users
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(60) NOT NULL,
    profile_picture VARCHAR(100) NOT NULL DEFAULT 'profile_pictures/default.png',
    country CHAR(3) NOT NULL DEFAULT "UA"
);

CREATE TABLE IF NOT EXISTS calendars
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    author_id INT,
    create_date TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

ALTER TABLE users ADD COLUMN default_calendar_id INT;
ALTER TABLE users ADD FOREIGN KEY (default_calendar_id) REFERENCES calendars(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS events
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    author_id INT,
    create_date TIMESTAMP,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NOT NULL,
    type ENUM('meeting', 'reminder', 'task') NOT NULL,
    color CHAR(8) default('#8a2be2'),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events_calendars
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    calendar_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users_calendars
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    calendar_id INT NOT NULL,
    user_role ENUM('watcher', 'assignee'),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE
);
