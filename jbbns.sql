CREATE TABLE Users (email TEXT PRIMARY KEY, hashed_password TEXT);

CREATE TABLE Pictures (file_name TEXT, email TEXT, FOREIGN KEY (email) REFERENCES Users(email));