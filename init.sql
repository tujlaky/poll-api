DROP TABLE IF EXISTS poll;

CREATE TABLE poll (
  id PRIMARY KEY,
  title text,
  username varchar(255),
  created_at timestamp DEFAULT now()::timestamp,
);

DROP TABLE IF EXISTS answer;

CREATE TABLE answer (
  id PRIMARY KEY,
  title text,
  poll_id integer REFERENCES poll(id),
);

DROP TABLE IF EXISTS vote;

CREATE TABLE vote (
  id SERIAL,
  username varchar(255),
  answer_id integer REFERENCES answer(id),
  created_at timestamp DEFAULT now()::timestamp,
  UNIQUE(username, answer_id)
);

