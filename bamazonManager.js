var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var numProducts = 0;

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user: "root",
    password: "",
    database: "shopDB"
});

connection.connect(function(err) {
    //error occurs
    if(err) {
        throw err;
    }

    console.log("connected as id " + connection.threadId + "\n");

    //obtaining number of rows in table
    connection.query("SELECT COUNT(*) FROM products", function(err, res) {
        //error occurs
        if(err) {
            throw err;
        }

        //console.log(res);
        numProducts = res[0]["COUNT(*)"];

        displayMenu();
    }); 
});



//displays manager menu options and lets user choose from them
function displayMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Select action",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
    ]).then(function(answers) {
        //console.log(answers);

        switch(answers.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    });
}

//lists all items and their ids, names, prices, and quantities
function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
        //error occurs
        if(err) {
            throw err;
        }

        console.table("\nInventory",res);
        returnToMenu();
    });
} 

//lists all items with less than 5 in stock
function viewLowInventory() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res) {
        //error occurs
        if(err) {
            throw err;
        }

        console.table("\nLow Inventory",res);
        returnToMenu();
    });
}

//prompts user to restock an item
function addToInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Input ID of item to restock:",
            validate: function (input) {
                if (Number.isInteger(parseFloat(input)) && 1 <= input && input <= numProducts) {
                    return true;
                }

                console.log(" Invalid ID");
            }
        },
        {
            type: "input",
            name: "numExtraItems",
            message: "Input number of additional items to purchase:",
            validate: function (input) {
                if (Number.isInteger(parseFloat(input)) && input >= 0) {
                    return true;
                }

                console.log(" Invalid quantity");
            }
        }
    ]).then(function(answers) {
        //console.log(answers);
        var query = "UPDATE products SET stock_quantity=? WHERE item_id=?";
        var id = answers.id;
        var numExtraItems = parseInt(answers.numExtraItems);
        
        restock(id, numExtraItems);
    });
}

//purchases additional quantities of a specific item
function restock(id, numExtraItems) {
    //obtaining current quantity of item
    var query1 = "SELECT product_name, stock_quantity FROM products WHERE item_id=?";
    connection.query(query1, id, function(err, res) {
        //error occurs
        if(err) {
            throw err;
        }

        //console.log(res);
        var item = res[0].product_name;
        var currentStock = parseInt(res[0].stock_quantity);

        //restocking item
        var query2 = "UPDATE products SET stock_quantity=? WHERE item_id=?";
        connection.query(query2, [currentStock + numExtraItems, id], function(err, res) {
            //error occurs
            if(err) {
                throw err;
            }

            //console.log(res);
            console.log(item + " restocked.\n");
            returnToMenu();
        });
    });
}

//prompts user to add an entirely new product to inventory
function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Product Name:"
        },
        {
            type: "input",
            name: "department",
            message: "Department:"
        },
        {
            type: "input",
            name: "price",
            message: "Price:"
        },
        {
            type: "input",
            name: "quantity",
            message: "Quantity:",
            validate: function (input) {
                if (Number.isInteger(parseFloat(input)) && input >= 0) {
                    return true;
                }

                console.log(" Invalid quantity");
            }
        }
    ]).then(function(answers) {
        var input = [
            answers.name,
            answers.department,
            answers.price,
            answers.quantity
        ];

        var query1 = "INSERT INTO products(product_name, department_name, price, stock_quantity)";
        var query2 = "VALUES (?, ?, ?, ?)";
        connection.query(query1 + query2, input, function(err, res) {
            //error occurs
            if(err) {
                throw err;
            }

            //console.log(res);
            returnToMenu();
        });
    });
}

//asks user if they wish to return to menu. Otherwise quits app.
function returnToMenu() {
    inquirer.prompt([
        {
            type:"confirm",
            name: "return",
            message: "Return to menu?"
        }
    ]).then(function(answers) {
        if(answers.return) {
            console.log("");
            displayMenu();
        }
        else {
            connection.end();
        }
    });
}