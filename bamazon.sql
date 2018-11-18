DROP DATABASE IF EXISTS shopDB;
CREATE DATABASE shopDB;

USE shopDB;

CREATE TABLE products(
    item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES
("Nintendo Switch", "Electronics", 299.99, 5), 
("Coco", "Movies", 19.99, 7), 
("Fifty Shades of Grey", "Books", 6.99, 2), 
("Invasion of Privacy-Cardi B", "Music", 9.49, 4),
("Samsung 50\" 4k TV", "Electronics", 327.99, 2),
("iPad", "Electronics", 379.99, 5),
("Super Mario Odyssey", "Videogames", 59.99, 6),
("Skyrim", "Videogames", 39.99, 4),
("The Godfather", "Movies", 14.99, 3),
("Pride and Prejudice", "Books", 8.89, 4); 

SELECT * FROM products;
