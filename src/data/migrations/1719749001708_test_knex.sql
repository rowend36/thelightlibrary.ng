ALTER TABLE book_authors
DROP CONSTRAINT book_authors_book_id_fkey,
ADD CONSTRAINT book_authors_book_id_fkey
FOREIGN KEY (book_id)
REFERENCES books(book_id)
ON DELETE CASCADE;

ALTER TABLE book_authors
DROP CONSTRAINT book_authors_author_id_fkey,
ADD CONSTRAINT book_authors_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES authors(author_id)
ON DELETE CASCADE;