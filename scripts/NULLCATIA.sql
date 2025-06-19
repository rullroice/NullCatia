CREATE DATABASE IF NOT EXISTS NULLCATIA;


USE NULLCATIA;


CREATE TABLE clan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE cat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    clan_id INT NOT NULL,
    FOREIGN KEY (clan_id) REFERENCES clan(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE territory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    clan_id INT NOT NULL,
    FOREIGN KEY (clan_id) REFERENCES clan(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE parchment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content TEXT,
    clan_id INT NULL,
    FOREIGN KEY (clan_id) REFERENCES clan(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE cat_parchment (
    cat_id INT,
    parchment_id INT,
    consultation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cat_id, parchment_id),
    FOREIGN KEY (cat_id) REFERENCES cat(id)
        ON DELETE CASCADE,
    FOREIGN KEY (parchment_id) REFERENCES parchment(id)
        ON DELETE CASCADE
);