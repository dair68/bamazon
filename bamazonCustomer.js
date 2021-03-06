var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var numProducts = 0;

//connecting to sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "shopDB"
});

connection.connect(function (err) {
    //error occurs
    if (err) {
        throw err;
    }
    console.log("connected as id " + connection.threadId);
    displayProducts();
});

//prints the data for all the products for sale to the console
function displayProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) {
            throw err;
        }

        numProducts = res.length;
        console.table("\nInventory", res);
        selectProduct();
    });
}

//allows user to specify a product and quantity they wish to purchase
function selectProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Input ID of item you wish to purchase:",
            validate: function (input) {
                if (Number.isInteger(parseFloat(input)) && 1 <= input && input <= numProducts) {
                    return true;
                }

                console.log(" Invalid ID");
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Input quantity:",
            validate: function (input) {
                if (Number.isInteger(parseFloat(input)) && input >= 0) {
                    return true;
                }

                console.log(" Invalid quantity");
            }
        }
    ]).then(function (answers) {
        var id = answers.id;
        var quantity = answers.quantity;

        sellProduct(id, quantity);
    });
}

//sells product, if there is enough stock
function sellProduct(id, quantity) {
    connection.query("SELECT product_name, price, stock_quantity FROM products WHERE item_id=?", id,
        function (err, res) {
            //error occurs
            if (err) {
                throw err;
            }

            //console.log(res);
            var item = res[0].product_name;
            var price = res[0].price;
            var stock = res[0].stock_quantity;

            //out of stock
            if (quantity > stock) {
                //console.log(stock);
                console.log("Insufficient quantity! Order canceled.\n");
                orderAgain();
            }
            //enough in stock
            else {
                var query = "UPDATE products SET stock_quantity=? WHERE item_id=?"
                connection.query(query, [stock - quantity, id], function (err, res) {
                    //error occurs
                    if (err) {
                        throw err;
                    }

                    var total = price * quantity;

                    //purchased one item
                    if (parseInt(quantity) === 1) {
                        console.log("Order successful! Purchased " + item + ".");

                    }
                    //purchased multiple items
                    else {
                        console.log("Order successful! Purchased " + quantity + " of " + item);
                    }
                    console.log("Your total is $" + total);
                    console.log("");

                    orderAgain();
                });
            }
        });
}

//asks user if they want to make another purchase. exits app if not.
function orderAgain() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "buyAgain",
            message: "Make another purchase?",
        }
    ]).then(function (answers) {
        //user will make another purchase
        if (answers.buyAgain) {
            displayProducts();
        }
        //user will not make anymore purchases
        else {
            console.log("Thanks for stopping by the back alley.");
            connection.end();
        }
    });
}