USE driveMate;

CREATE TABLE IF NOT EXISTS streets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    speed_limit INT NOT NULL CHECK (speed_limit BETWEEN 40 AND 100)
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