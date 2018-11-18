var mysql = require("mysql");
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
    connection.end();
});

//prints the data for all the products for sale to the console
function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) {
            throw err;
        }

        console.table("Inventory",res);
    });
}