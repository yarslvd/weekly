use chronos_api;

DROP TABLE users_calendars;
DROP TABLE events_calendars;
DROP TABLE events;
ALTER TABLE users DROP FOREIGN KEY users_ibfk_1;
DROP TABLE calendars;
DROP TABLE users;
