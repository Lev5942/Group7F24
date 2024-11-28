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
