CREATE TABLE trip_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATETIME NOT NULL,
  duration VARCHAR(50) NOT NULL,
  average_speed FLOAT NOT NULL,
  total_distance FLOAT NOT NULL,
  warnings INT NOT NULL,
  trip_score INT NOT NULL
);
