DROP TABLE purchase;

-- Make reference the primary key
CREATE TABLE purchase (
    reference VARCHAR(64) PRIMARY KEY,
    cart_id INT REFERENCES carts(cart_id),
    purchase_price DECIMAL(13,5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(16)
);

