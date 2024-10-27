ALTER TABLE books ADD COLUMN recommended BOOL;
ALTER TABLE books ADD COLUMN enabled BOOL;
ALTER TABLE books ADD COLUMN is_presale BOOL;


-- Book Categories Join Table
CREATE TABLE featured (
    book_id INT REFERENCES books(book_id) PRIMARY KEY,
    synopsis TEXT,
    enabled BOOL,
    feature_image1 VARCHAR(255),
    feature_image2 VARCHAR(255),
    feature_image3 VARCHAR(255)
);

