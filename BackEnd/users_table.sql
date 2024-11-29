drop database if exists drivemate;
CREATE DATABASE driveMate;

USE driveMate;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password) VALUES ('user1', '1qaz@WSX');
select * from users;

SELECT * FROM users WHERE username = 'user1' AND password = '1qaz@WSX';

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '2wsx#EDC';
-- FLUSH PRIVILEGES;
-- SELECT user, host FROM mysql.user WHERE user = 'root';

CREATE TABLE streets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  speed_limit INT NOT NULL
);

CREATE TABLE trip_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date VARCHAR(255) NOT NULL,
  duration VARCHAR(255) NOT NULL,
  average_speed DECIMAL(10, 2) NOT NULL,
  total_distance VARCHAR(255) NOT NULL,
  warnings INT NOT NULL,
  trip_score INT NOT NULL
);


INSERT INTO streets (name, speed_limit) VALUES
('Main Street', 50),
('Elm Avenue', 60),
('Oak Lane', 70),
('Pine Street', 40),
('Maple Drive', 90),
('Birch Road', 100),
('Cedar Way', 55),
('Spruce Boulevard', 80),
('Ash Street', 45),
('Chestnut Avenue', 75),
('Willow Lane', 65),
('Sycamore Drive', 85),
('Cherry Street', 50),
('Peach Avenue', 60),
('Pear Lane', 70),
('Apple Drive', 55),
('Plum Road', 80),
('Grape Boulevard', 45),
('Fig Street', 90),
('Walnut Way', 100);

select * from streets;

SHOW TABLES;

ALTER TABLE trip_history
MODIFY COLUMN total_distance FLOAT;
