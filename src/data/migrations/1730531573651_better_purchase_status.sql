UPDATE purchase SET status = 'success' WHERE status = '0';
UPDATE purchase SET status = 'failure' WHERE status = '1';
UPDATE purchase SET status = 'pending' WHERE status = '2';