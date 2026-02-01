SET session_replication_role = replica;

DELETE FROM "booking";
DELETE FROM "job";
DELETE FROM "quotes";
DELETE FROM "reviews";
DELETE FROM "users";

SET session_replication_role = origin;