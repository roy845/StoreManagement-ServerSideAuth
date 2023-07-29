# React Store Management App

This project is a store management application built using React, Redux (for state management), and Firebase and MongoDB (for database and user authentication). The application provides an interface for managing products, customers, and purchases, with initial data including two products and two customers. Users can interact with the system through several pages including "Menu - as navigation drawer", "Products", "Edit Product", "Customers", "Edit Customer", and "Purchases". Additionally, a user authentication & authorization system is implemented using MongoDB and JWT authentication & authorization service.

## Features

1. User Authentication & Authorization: User login/register features using JWT authentication and MongoDB. User roles are defined as "User" and "Admin".

- Login

<img src = "https://imgtr.ee/images/2023/07/26/63ad47b15a1b7c93e0e2db9e3b08c7f0.png" width = "800px" height = "400px">

- Register

<img src="https://imgtr.ee/images/2023/07/26/d62918172d36886373cdd9850fba89b2.png" width = "800px" height = "400px">

2. Menu Navigation: Provides navigation to "Products", "Customers", and "Purchases" pages and also for logging out the current connected user.

<img src="https://imgtr.ee/images/2023/07/26/444eaf5c1d4cb703bac2233d29d2b2c4.png" alt="444eaf5c1d4cb703bac2233d29d2b2c4.png" height="100%">

3. Products Page: Displays total amount of purchased products and detailed product data. Users can add new products to customers from this page.

<img src="https://imgtr.ee/images/2023/07/29/72b85c197c6ce3a478767267e476bdad.png" alt="72b85c197c6ce3a478767267e476bdad.png"  width = "800px" height = "400px">

- Add product

<img src="https://imgtr.ee/images/2023/07/29/31df3b6aee807d4bcc804e801127f0c2.png" alt="31df3b6aee807d4bcc804e801127f0c2.png" width = "800px" height = "400px">

4. Edit Product Page: Allows Admin users to update or delete product data.

<img src="https://imgtr.ee/images/2023/07/29/7f054e27ebc0a683f7987900a9fa5608.png" alt="7f054e27ebc0a683f7987900a9fa5608.png" width = "800px" height = "400px">

5. Customers Page: Showcases customers and their purchased products and purchased dates. Users can also buy products from this page.

<img src="https://imgtr.ee/images/2023/07/29/b7cac91c602d7b8b570a27de57520cce.png" alt="b7cac91c602d7b8b570a27de57520cce.png" width = "800px" height = "400px">

- Add product

<img src="https://imgtr.ee/images/2023/07/29/f876b48ebe01a67e8015db149cac047d.png" alt="f876b48ebe01a67e8015db149cac047d.png" width = "800px" height = "400px">

<img src="https://imgtr.ee/images/2023/07/29/825bf6c3685dae16237b7bc708fbbc83.png" alt="825bf6c3685dae16237b7bc708fbbc83.png" width = "800px" height = "400px">

6. Edit Customer Page: Allows Admin users to update or delete customer data.

<img src="https://imgtr.ee/images/2023/07/29/ede8ba4fc3880e62a4feb08645efb9ef.png" alt="ede8ba4fc3880e62a4feb08645efb9ef.png" width = "800px" height = "400px">

7. Purchases Page: Allows users to search for purchases by product, customer, or date.

<img src="https://imgtr.ee/images/2023/07/29/36f9507c29a3cba7535fda1154138619.png" alt="36f9507c29a3cba7535fda1154138619.png" width = "800px" height = "400px">

- No results from query found: If a user performs a search on the Purchases page and there are no results that match the search criteria, a helpful message will be displayed to inform the user that no search results were found.

<img src="https://imgtr.ee/images/2023/07/29/2d98e363fdbcfe1465420a88f918cea2.png" alt="2d98e363fdbcfe1465420a88f918cea2.png" width = "800px" height = "400px">

8. Not Found Page: This page is used when a user tries to navigate to a non-existing page or route in your application.

<img src="https://imgtr.ee/images/2023/07/27/54fdf6d9524ade27f11797cde9a315f6.png" alt="54fdf6d9524ade27f11797cde9a315f6.png" width = "800px" height = "400px">

9. Unauthorized Page: This page is used when a user tries to access a resource for which they do not have permission.

<img src="https://imgtr.ee/images/2023/07/27/5ffc7f634087eac3f8d90765cb906cf2.png" alt="5ffc7f634087eac3f8d90765cb906cf2.png" width = "800px" height = "400px">

## Database Collections

**Products**:

- ID (Primary Key)
- Name
- Price
- Quantity

**Customers**:

- ID (Primary Key)
- First Name
- Last Name
- City

**Purchases**:

- ID (Primary Key)
- CustomerID (Foreign Key)
- ProductID (Foreign Key)
- Date

**Users (for authentication & authorization)**:

- Username (Primary Key)
- Password
- Role ("User" or "Admin")

## Installation

- Clone the repository: git clone https://github.com/username/react-store-management.git

### Client

2. Open a new terminal.
3. Navigate to the client directory: `cd client`.
4. Install dependencies: `npm/yarn install`.
5. Create a `.env` file in the client directory.
6. Add your Firebase configuration in a `.env` file at the root of the project.
7. Run the client: npm/yarn start.
8. Open http://localhost:3000 to view it in the browser.

### Server

1. Open a new terminal.
2. Navigate to the server directory: `cd server`.
3. Install dependencies: `npm/yarn install`.
4. Create a `.env` file in the server directory.
5. In the `.env` file, set the following variables:

   - `PORT`: The port number on which the server will run (e.g., `PORT=8800`).
   - `MONGO_DB_URI`: The MongoDB connection URI for connecting to the database (e.g., `MONGODB_URI=mongodb://localhost:27017/mydatabase`).
   - `JWT_SECRET_KEY`:This key used for authentication and authorization.
     Here is how you can generate this key:

     1.Open a terminal.

     2.Type the following command and press Enter to generate a random JWT secret key

     require('crypto').randomBytes(32).toString('hex')

     3.Copy the generated secret key.

     4.Open the .env file in the server directory.

     5.Set the JWT_SECRET_KEY variable by pasting the generated secret key.

     For example:

     JWT_SECRET_KEY=generated_secret_key

6. Save the `.env` file.
7. Run the server: `node server.js` or npm/yarn start.

## Permissions

1. All registered users can see the "Products", "Customers", and "Purchases" pages.
2. Only Admins can edit a product or customer data.

## Technologies Used

- **VS Code**
  <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png" width = "60px" height = "60px">
- **NodeJS**
  <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" width = "60px" height = "60px">

- **React**
  <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" width = "60px" height = "60px">

- **Redux**
  <img src = "https://www.svgrepo.com/show/303557/redux-logo.svg" width = "60px" height = "60px">

- **Firebase**
  <img src = "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-firebase-icon.png" width = "60px" height = "60px">

- **MongoDB**
  <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/2560px-MongoDB_Logo.svg.png" width = "60px" height = "60px">

- **Express**
  <img src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width = "60px" height = "60px">

- **JSON Web Tokens**
  <img src = "https://cdn.worldvectorlogo.com/logos/jwt-3.svg" width = "60px" height = "60px">
