ALTER TABLE cart_book
DROP CONSTRAINT cart_book_cart_id_fkey,
ADD CONSTRAINT cart_book_cart_id_fkey
FOREIGN KEY (cart_id)
REFERENCES carts(cart_id)
ON DELETE CASCADE;