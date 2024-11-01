-- posts table
CREATE TABLE posts (
    post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- comments table
CREATE TABLE comments (
    comment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(16) NOT NULL DEFAULT 'pending'
);

-- tags table
CREATE TABLE tags (
    tag_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL
);

-- post_tags table (many-to-many relation between posts and tags)
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- likes table (for likes on posts)
CREATE TABLE likes (
    like_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- post_media table (for media associated with posts, like images or videos)
CREATE TABLE post_media (
    media_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
    media_url VARCHAR(255) NOT NULL,
    media_type VARCHAR(16) NOT NULL,
    alt_text VARCHAR(255)
);

-- indexes for better query performance
CREATE INDEX idx_user_id ON posts(user_id);
CREATE INDEX idx_post_id ON comments(post_id);
CREATE INDEX idx_post_tag ON post_tags(post_id);
CREATE INDEX idx_like_post_user ON likes(post_id, user_id);
CREATE INDEX idx_post_media_post_id ON post_media(post_id);
