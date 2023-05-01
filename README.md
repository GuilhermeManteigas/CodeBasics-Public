### For this public version the Database credentials and page certificates have been removed! For the code to run you will need to create a local database using the Database creation script found in the DB-creation-script.txt file


# CodeBasics

Code Basics is a programming language and development environment created with the objective of making learning to programme easier for beginners.

## Requirements and dependencies

Download version 18.16.0 or any compatible version of Node.js from https://nodejs.org/en
Download and install a recent version of Firefox, Chrome, Edge (Other browsers are likely to be supported but have not been tested)


## Running instructions

Open Command Prompt and navigate to the project folder, this can be done by typing cd “folder path” and pressing enter.
Still in the Command Prompt type node server.js
Now that the application is running it can be accessed using any browser and going to localhost:5000 


## Creating and using a local database

Download and install MySQL, either using the standalone version from https://www.mysql.com/ or by installing a web server solution stack package such as XAMP from https://www.apachefriends.org/.
Start the MySQL Database and use the Database creation code found in the “DB-creation-script.txt” text file to create the database.
Open the file “server.js” and go to line 100 there you will find the database connection settings. Replace the host, user, password and database with the credentials of your local database.

## Debugging the programming language

To make debugging the programming language easier and independent of the web platform, there is the “languagedebug.js” file. This file contains a run code for the language as well as a variable containing code that can be altered.
This file can be run by using the Command Prompt navigating to the project folder and typing node languagedebug.js. Or it can be opened with an IDE such as Visual Studio Code and run by pressing “CTRL” + “F5” and selecting Node.js.


## Adding support to more languages 

To add a new language translation navigate to “../private/translation” and open the translation.js file. Copy one of the other language entries and replace them with the desired translation. Once that is done, navigate to “../public” and open the index.html file and add the language as an option to the select object found at line 41. Now repeat the previous steps but for the documentation.html file.


## Author

- [@GuilhermeManteigas](https://www.github.com/GuilhermeManteigas)