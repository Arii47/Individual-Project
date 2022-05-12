DROP TABLE IF EXISTS searches CASCADE;
    CREATE TABLE IF NOT EXISTS searches (
    id SERIAL PRIMARY KEY,
    artistName TEXT NOT NULL,
    artistFB TEXT NOT NULL,
    formationYear TEXT NOT NULL, 
    artistGenre TEXT NOT NULL, 
    artistBio TEXT NOT NULL);