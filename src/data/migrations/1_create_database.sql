-- Authors Table
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    biography TEXT,
    tsv tsvector,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    pdf_url TEXT,
    published_date DATE,
    tsv tsvector,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book Authors Join Table
CREATE TABLE book_authors (
    book_id INT REFERENCES books(book_id),
    author_id INT REFERENCES authors(author_id),
    PRIMARY KEY (book_id, author_id)
);

-- Book Categories Join Table
CREATE TABLE book_categories (
    book_id INT REFERENCES books(book_id),
    category_id INT REFERENCES categories(category_id),
    PRIMARY KEY (book_id, category_id)
);

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(book_id),
    user_id INT REFERENCES users(user_id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Full-Text Search for Authors
-- ALTER TABLE authors ADD COLUMN tsv tsvector;
UPDATE authors SET tsv = to_tsvector('english', coalesce(name, '') || ' ' || coalesce(biography, ''));
CREATE TRIGGER tsvectorupdate_authors BEFORE INSERT OR UPDATE ON authors FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(tsv, 'pg_catalog.english', name, biography);

-- Full-Text Search for Books
-- ALTER TABLE books ADD COLUMN tsv tsvector;
UPDATE books SET tsv = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, ''));
CREATE TRIGGER tsvectorupdate_books BEFORE INSERT OR UPDATE ON books FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(tsv, 'pg_catalog.english', title, description, content);

-- Function to Update Books' Tsvector When Authors Change
CREATE OR REPLACE FUNCTION update_books_tsv() RETURNS TRIGGER AS $$
DECLARE
    author_names TEXT;
BEGIN
    SELECT string_agg(name, ' ') INTO author_names
    FROM authors
    JOIN book_authors ON authors.author_id = book_authors.author_id
    WHERE book_authors.book_id = NEW.book_id;

    UPDATE books
    SET tsv = setweight(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')), 'A') ||
              setweight(to_tsvector('english', coalesce(author_names, '')), 'B')
    WHERE book_id = NEW.book_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Book Authors
CREATE TRIGGER update_books_tsv_trigger
AFTER INSERT OR UPDATE ON book_authors
FOR EACH ROW EXECUTE PROCEDURE update_books_tsv();

-- GIN Index on Books' Tsvector
CREATE INDEX books_tsv_idx ON books USING gin(tsv);
