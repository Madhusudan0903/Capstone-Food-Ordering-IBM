-- Run if you already seeded with the old bcrypt (wrong for password123).
-- Sets password123 for all seeded users.

UPDATE `users` SET `password_hash` = '$2a$10$KCaKdmMGUJgg45ughU7DO.z72/S4O.os9s2.ZHOAtgPbxmPWtCyzi'
WHERE `email` IN (
  'john@example.com',
  'jane@example.com',
  'admin@restaurant.com',
  'driver@delivery.com'
);
