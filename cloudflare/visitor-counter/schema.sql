CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0)
);

CREATE TABLE IF NOT EXISTS country_counts (
  code TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0)
);

CREATE TABLE IF NOT EXISTS latest_visit (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  country_code TEXT NOT NULL,
  visited_at TEXT NOT NULL
);
