# restfulRoutingBlog
A simple blog written with Node.js, Express.js, and MongoDB to practice REST routing.

Includes session based authentication with Passport.js.

---
## Requirements

For development, you will only need Node.js installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following commands.

    $ node --version

    $ npm --version

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### MongoDB installation

  The project uses MongoDB as a database. Find the full installation instructions on the [official MongoDB website] (https://docs.mongodb.com/manual/installation/).
  
  Once installed, run the following command to start the Mongo server.
  
      $ mongod 
---

## Install

    $ git clone https://github.com/ekelseya/restfulRoutingBlog
    $ cd restfulRoutingBlog
    $ npm install

## Configure the project

### index.js

  You will need to make some changes to index.js:
    
  Change 
  
    mongoose.connect(process.env.DATABASEURL);
    
  to:
  
    mongoose.connect("mongodb://localhost/blog");
  
  Note: you can name your database whatever you want!
  
  Change
  
    app.listen(process.env.PORT, process.env.IP, function(){console.log("We did it!");
    
  to:
  
    app.listen(3000, function(){console.log("We did it!");
    
  Optionally, you can set DATABASEURL and PORT to your own environmental variables.
  
### models/users.js

  Users are not granted admin permission by default. If you want to allow a user to create posts, you will have to change isAdmin to true.
  
  You can either do this in your database, or change the default in the User schema.

## Running the project

  To start the project, enter the following in the terminal:
  
    $ npm start

  Navigate to https://localhost:3000/ and create your first user!
    
### Credit to Igor Mandello for the README template

https://gist.github.com/Igormandello/57d57ee9a9f32a5414009cbe191db432
