ALTER TABLE book_categories
DROP CONSTRAINT book_categories_book_id_fkey,
ADD CONSTRAINT book_categories_book_id_fkey
FOREIGN KEY (book_id)
REFERENCES books(book_id)
ON DELETE CASCADE;

ALTER TABLE book_categories
DROP CONSTRAINT book_categories_category_id_fkey,
ADD CONSTRAINT book_categories_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(category_id)
ON DELETE CASCADE;