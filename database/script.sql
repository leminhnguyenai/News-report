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