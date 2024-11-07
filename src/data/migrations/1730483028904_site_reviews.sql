CREATE TABLE site_reviews (
    comment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    guest_name VARCHAR(255),
    guest_title VARCHAR(255),
    guest_photo VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);
