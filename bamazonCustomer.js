var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

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
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

//prints the data for all the products for sale to the console
function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) {
            throw err;
        }

        console.table("Inventory", res);
        selectProduct();
    });
}

//allows user to specify a product and quantity they wish to purchase
function selectProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "productID",
            message: "Input ID of item you wish to purchase:"
        }
    ]).then(function(answers) {
        console.log(answers.productID);
        obtainProduct(answers.productID);
    });
}

//obtains a product based on it's id
function obtainProduct(id) {
    connection.query("SELECT * FROM products WHERE item_id=?", id, 
    function(err, res) {
        //error occurs
        if(err) {
            throw err;
        }

        console.table(res);
        selectQuantity(id);
    });
}

//lets user select quantity of items to buy for a certain product 
function selectQuantity(id) {
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "Input quantity:"
        }
    ]).then(function(answers) {
        console.log(answers.quantity);
        sellProduct(id, answers.quantity);
    });
}

//sells product, if there is enough stock
function sellProduct(id, quantity) {
    connection.query("SELECT * FROM products WHERE item_id=?", id, 
    function(err, res) {
        //error occurs
        if(err) {
            throw err;
        }

        //console.log(res);
        var stock = res[0].stock_quantity;
        var price = res[0].price

        //out of stock
        if(quantity > stock) {
            console.log(stock);
            console.log("Insufficient quantity! Order canceled.");
            //connection.end();
            orderAgain();
        }
        //enough in stock
        else {
            var query = "UPDATE products SET stock_quantity=? WHERE item_id=?"
            connection.query(query,[stock - quantity, id], function(err, res) {
                //error occurs
                if(err) {
                    throw err;
                }

                var total = price * quantity;
                console.log("Order successful! Your total is $" + total);
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
    ]).then(function(answers) {
        //user will make another purchase
        if(answers.buyAgain) {
            displayProducts();
        }
        //user will not make anymore purchases
        else {
            console.log("Thank you for shopping at Walmart.");
            connection.end();
        }
    });
}