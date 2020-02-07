# Nextjs 9 + Material UI + mySQL Starter

This is a starter project for those who wish to use server-side-rendered React with the latest Next.js 9 API routes, the Material UI theme and mySQL. We are using Knex.js for query building so you could also use MSSQL, PostgreSQL, SQLite3 or Oracle databases.

The goal of this project is not to be merely a 'demo' but to be fully working code that could be deployed with only a few tweaks. So for example, pages inside of login  are protected using jsonWebTokens and API routes include CORS.

## Frameworks Included

### Next.js 9

Next.js is a React-powered SSR (server-side rendered) JavaScript framework created by Zeit. Server-side rendered apps are faster and simpler, since the same React code runs on the server at page load and also on the client side after page load. Pages are delivered to the client as HTML, not a huge bundle of javascript that must be parsed on the client side before the page is ready. 

Also, server and client code are in javascript so there is only one language to learn.

Next.js version 9 introduced dynamic API routes, meaning you no longer need to use Express.js for routing. You can handle that in Next.js itself. This project demonstrates one way of handling routing.

### React

React is the built-in front-end framework of Next.js so you get React out of the box. You can use all of the usual React extensions and tools that you would normally use in React.

### Material UI

You want your website to look professional so you will need a styling framework. Material UI is the go-to framework here. It has a component for every use case and scales nicely to mobile so you don't have to fuss with that so much.

### mySQL

mySQL is the most popular database on the planet so this is a solid choice. But we use Knex.js for query building, which supports several other SQL databases. All you need to change is the connection details - everything else is the same.

## Components

### /components/layout.js

The layout component wraps all pages, and the mainNav is included so every page has the same nav and layout.

### /components/mainNav.js

The nav detects whether the user is logged in or not and shows the correct icons for each condition.

### /components/loginModal.js

This modal includes a custom DialogTitle, StyledButton and slideUp animation. Currently the login is just a github profile username, but we will add user sign up, login, email confirmation and forgot password functionality soon.

## Pages

### /pages/index.js

This is the only logged-out page. If the user tries to access any other pages while logged out they will be redirected to this one. 

### /pages/profile.js

Once logged in, the user can click on the Profile link to see the Github profile information.

### /pages/wordlist/[page].js

Here we have a word list with **server-side** pagination. With only 100 rows, client-side pagination makes more sense and is easy to build with the Material UI EnhancedTable component. But what if your list has 100,000 rows? That's what this is for. It's far simpler to just pull 50 rows at a time from the server than to devise a complex lazy-load solution. We have SSR, so why not take advantage of it?

This list is pulled from data in mySQL, so you can see how we use Knex to pull that data into the list. We use the files in db/migrations and db/seeds to create that data.

### /pages/_app.js

This is a special Next.js page that wraps your app. Here we are using the withError Higher-order component (HOC) to catch errors thrown in getInitialProps() functions. 

### /pages/_document.js

Another special Next.js page that wraps the HTML document. Here we are injecting Material UI, a custom theme config, and a custom font. 

### /pages/_error.js

Yet another special Next.js page that captures errors. We aren't doing anything interesting here right now. 

## API Routes

### /api/login.js

This API 'logs in' the user by pulling the data for a public Github username. Then the data is signed using jsonWebToken and that token is sent back to the client. The client then puts it in a cookie.

### /api/profile

To get the Github profile data we need to decrypt the jsonWebToken and pull the github id.

### /api/wordlist/[...params].js

This API routes the wordlist url to the correct function. The dynamic route slug [...params] alows us to send any url params to the /api/wordlist/ route.

Currently we have only /readAny but soon we will have readOne, create, update and delete. Note that CORS headers are sent in the response, and we are checking the jsonWebToken for logged-in status.

## Database

### /knexfile.js

This file configures the database. It uses environment variables from an .env file. Also the seeds and migrations folder paths are defined.

### /db/migrations

We have two migration files for defining tables but currently only the wordlist.js file is needed. It defines the tables 'words' and 'types', which are related by foreign key. 

The member table will be for member logins.

### /db/seeds

These files will seed some data into the 'words' and 'types' tables.

## Utilities

### /utils/auth.js

This file has methods for encrypting/decrypting jsonWebTokens, login/logout and higher-order component withAuthSync.

### /utils/theme.js

The Material UI theme is defined here. You probably never want the default theme...

### /utils/withError

This is a higher-order component used in _app.js to globally catch errors in getInitialProps() functions.

## Dependencies

* NodeJS version >= 10.17
* mysql-server 5.7
* knex

## Installing

* Install mysql-server on your system and create a database named 'wordlist'. User is 'root' and password is 'password' for development server. Make sure the mysql server is running.

* Install NodeJS 10.17 or higher on your system.

* Install knex globally on your system.
```
npm install knex -g
```

* Clone this repo and cd to that folder.

* Install node module dependencies
```
npm install
```

* Create a new root file '.env' and copy env.env contents to it.

* Run database migrations
```
knex migrate:latest
```

* Run the databse seeds
```
knex seed:run
```


* Start the development server
```
npm run dev
```
Go to http://localhost/3000 to view the index page.

## Coming Soon

* User login instead of Github ID, which is just a placeholder for proper user login with database.
* Testing scripts
* Client-side pagination example

## Author

* **Adam Love**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

