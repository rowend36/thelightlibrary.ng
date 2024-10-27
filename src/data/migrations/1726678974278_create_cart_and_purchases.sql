CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    checked_out BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book Categories Join Table
CREATE TABLE cart_book (
    cart_id INT REFERENCES carts(cart_id),
    book_id INT REFERENCES books(book_id),
    book_price DECIMAL(13,5),
    PRIMARY KEY (cart_id, book_id)
);

CREATE TABLE purchase (
    cart_id INT REFERENCES carts(cart_id) PRIMARY KEY,
    purchase_price DECIMAL(13,5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    reference VARCHAR(64)
);

