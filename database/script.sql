CREATE TABLE origin (
	origin_id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(30),
	url VARCHAR(100)
);

CREATE TABLE topics (
	topic_id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(30)
);

CREATE TABLE origin_and_topics (
	origin_id INT, 
	topic_id INT
);

CREATE TABLE history (
	news_id INT PRIMARY KEY AUTO_INCREMENT,
	date_watched DATE,
	origin INT
);

ALTER TABLE origin_and_topics 
ADD FOREIGN KEY (origin_id) REFERENCES origin(origin_id),
ADD FOREIGN KEY (topic_id) REFERENCES topics(topic_id);

ALTER TABLE history
ADD FOREIGN KEY (origin) REFERENCES origin(origin_id);

ALTER TABLE history
ADD url VARCHAR(100);

ALTER TABLE topics 
ADD query VARCHAR(80);

SELECT * FROM origin;
SELECT * FROM topics;
SELECT * FROM history;
SELECT * FROM origin_and_topics;

INSERT INTO topics (name, query) VALUES
("MMA", "MMA news"),
("Web development", "Web development news"),
("Notion", "Notion"),
("AI", "LLM");

INSERT INTO origin (name, url) VALUES 
("Full Mount MMA", "https://www.youtube.com/channel/UCRXsUJyZKyByJixT_7mZ1Xg"),
("MMA WORLD", "https://www.youtube.com/channel/UClkruV5L-hsu20MDYOa1hvw"),
("MMA Junkie", "https://www.youtube.com/channel/UCxQfUu6vIJGZDODSwhr0m9w");


INSERT INTO origin_and_topics (origin_id, topic_id) VALUES
(1,1),
(2,1),
(3,1);

INSERT INTO origin (name, url) VALUES
("Fireship", "https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA"),
("Flux Academy", "https://www.youtube.com/channel/UCN7dywl5wDxTu1RM3eJ_h9Q");

INSERT INTO origin_and_topics (origin_id, topic_id) VALUES
(4,2),
(5,2);

INSERT INTO origin (name, url) VALUES
("Chris's Notion", "https://www.youtube.com/channel/UCWXmJluzEAJfLk4ruxFeLtw"),
("Marcello Ascani", "https://www.youtube.com/channel/UCS5PaGnSnFUnrjSc80XRnqw");

INSERT INTO origin_and_topics (origin_id, topic_id) VALUES
(6,3),
(7,3);

INSERT INTO origin (name, url) VALUES
("All About AI", "https://www.youtube.com/channel/UCR9j1jqqB5Rse69wjUnbYwA"),
("VirtualizationHowto", "https://www.youtube.com/channel/UCrxcWtpd1IGHG9RbD_9380A");

INSERT INTO origin_and_topics (origin_id, topic_id) VALUES
(8,4),
(9,4);

ALTER TABLE topics 
ADD point INT DEFAULT 0;

ALTER TABLE origin 
ADD point INT DEFAULT 0;

SELECT * FROM origin ORDER BY point DESC;

SELECT origin_and_topics.topic_id, origin.name, origin.url, origin.point FROM origin
INNER JOIN origin_and_topics ON origin.origin_id = origin_and_topics.origin_id
WHERE origin_and_topics.topic_id = 1 AND url LIKE "https://www.youtube.com%";