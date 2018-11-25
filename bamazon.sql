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
("Nintendo Switch", "Electronics", 220, 5), 
("Coco", "Movies", 11.99, 7), 
("Fifty Shades of Grey", "Books", 6.99, 2), 
("The Dark Side of the Moon", "Music", 7.77, 4),
("Samsung 4k TV", "Electronics", 299.99, 2),
("iPad", "Electronics", 349.99, 5),
("Super Mario Odyssey", "Videogames", 54.99, 6),
("Skyrim", "Videogames", 34.99, 4),
("The Godfather", "Movies", 8.99, 3),
("Pride and Prejudice", "Books", 8.89, 4); 

SELECT * FROM products;
