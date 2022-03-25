DROP TABLE IF EXISTS poll CASCADE;

CREATE TABLE poll (
  id SERIAL PRIMARY KEY,
  title text,
  username varchar(255),
  created_at timestamp DEFAULT now()::timestamp
);

DROP TABLE IF EXISTS answer CASCADE;

CREATE TABLE answer (
  id SERIAL PRIMARY KEY,
  title text,
  poll_id integer REFERENCES poll(id),
  created_at timestamp DEFAULT now()::timestamp
);

DROP TABLE IF EXISTS vote;

CREATE TABLE vote (
  id SERIAL PRIMARY KEY,
  username varchar(255),
  poll_id integer REFERENCES poll(id),
  answer_id integer REFERENCES answer(id),
  created_at timestamp DEFAULT now()::timestamp,
  UNIQUE(username, poll_id)
);

