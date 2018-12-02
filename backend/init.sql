DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS logins;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  userId INTEGER AUTO_INCREMENT PRIMARY KEY,
  profileName VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255),
  createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS logins (
  loginId INTEGER AUTO_INCREMENT PRIMARY KEY,
  userId INTEGER NOT NULL,
  email VARCHAR(255) UNIQUE,
  passwordHash CHAR(60),
  verificationHash CHAR(60),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS posts (
  mediaId INTEGER AUTO_INCREMENT PRIMARY KEY,
  userId INTEGER NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  wins INTEGER DEFAULT 0,
  matches INTEGER DEFAULT 0,
  dateTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS votes (
  voteId INTEGER AUTO_INCREMENT PRIMARY KEY,
  userId INTEGER,
  winMediaId INTEGER NOT NULL,
  winUserId INTEGER NOT NULL,
  lossMediaId INTEGER,
  lossUserId INTEGER,
  dateTime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (winMediaId) REFERENCES posts(mediaId) ON DELETE CASCADE,
  FOREIGN KEY (lossMediaId) REFERENCES posts(mediaId) ON DELETE CASCADE,
  FOREIGN KEY (winUserId) REFERENCES users(userId),
  FOREIGN KEY (lossUserId) REFERENCES users(userId),
  FOREIGN KEY (userId) REFERENCES users(userId)
);

DELIMITER //

CREATE TRIGGER after_votes_insert
AFTER INSERT ON votes FOR EACH ROW
BEGIN
  DECLARE winPostWins INTEGER;
  DECLARE winPostMatches INTEGER;
  DECLARE lossPostMatches INTEGER;
  SELECT SUM(CASE WHEN winMediaId = NEW.winMediaId THEN 1 ELSE 0 END), COUNT(*) INTO @winPostWins, @winPostMatches FROM votes WHERE winMediaId = NEW.winMediaId OR lossMediaId = NEW.winMediaId;
  SELECT COUNT(*) INTO @lossPostMatches FROM votes WHERE winMediaId = NEW.lossMediaId OR lossMediaId = NEW.lossMediaId;
  UPDATE posts SET wins = @winPostWins, matches = @winPostMatches WHERE mediaId = NEW.winMediaId;
  UPDATE posts SET matches = @lossPostMatches WHERE mediaId = NEW.lossMediaId;
  END //

DELIMITER ;
