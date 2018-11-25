# bamazon
A node application featuring a virtual store for users to "purchase" lucrative holiday items and even manage the store!

# Set-up
After cloning the git repsitory, navigate to the directory with all the files and enter `npm install` in order to install all the appropriate modules to run the app. Then, set up the databases in mySQL by running the .sql file in either a mySQL GUI such as MySQL Workbench, or from the command line.

# Using the App
Enter `node bamazonCustomer.js` into the command line in order to enter customer mode. Here the app will display a table of products and prices. The app will ask the user for an item ID and how much of said item they wish to buy. If the item is in stock, the purchase will commence and the total will be displayed. Otherwise, the order is canceled. The user can then choose to purchase another item, or quit.

Enter `node bamazonManager.js` into the command line to enter manager mode. Here, the user has the ability to view item stats including prices and inventory, restock items, and even put new items in stock. Choose whichever option from the menu is most suitable.
