# React Store Management App

This project is a store management application built using React, Redux (for state management), and Firebase and MongoDB (for database and user authentication). The application provides an interface for managing products, customers, and purchases, with initial data including two products and two customers. Users can interact with the system through several pages including "Menu - as navigation drawer", "Products", "Edit Product", "Customers", "Edit Customer", and "Purchases". Additionally, a user authentication & authorization system is implemented using MongoDB and JWT authentication & authorization service.

## Features

1. User Authentication & Authorization: User login/register features using JWT authentication and MongoDB. User roles are defined as "User" and "Admin".

- Login

<img src="https://imgtr.ee/images/2023/07/31/d0167405ad70592b178dfa05aa099d56.png" alt="d0167405ad70592b178dfa05aa099d56.png" width = "800px" height = "400px">

- Register

<img src="https://imgtr.ee/images/2023/07/31/c4588eaee34cb294808e052178462974.png" alt="c4588eaee34cb294808e052178462974.png" width = "800px" height = "400px">

2. Menu Navigation: Provides navigation to "Products", "Customers", and "Purchases" pages and also for logging out the current connected user.

<img src="https://imgtr.ee/images/2023/07/26/444eaf5c1d4cb703bac2233d29d2b2c4.png" alt="444eaf5c1d4cb703bac2233d29d2b2c4.png" height="100%">

3. Products Page: Displays total amount of purchased products and detailed product data. Users can add new products to customers from this page.

<img src="https://imgtr.ee/images/2023/07/31/e5c7b1ffa95e0a1f8e3c4e0484b06245.png" alt="e5c7b1ffa95e0a1f8e3c4e0484b06245.png" width = "800px" height = "400px">

- Add product

<img src="https://imgtr.ee/images/2023/07/31/93a0d6beb3b30c3b284a3fed7568f97a.png" alt="93a0d6beb3b30c3b284a3fed7568f97a.png" width = "800px" height = "400px">

4. Edit Product Page: Allows Admin users to update or delete product data.

<img src="https://imgtr.ee/images/2023/07/31/8e28c3c1a14fcb57dd1ee7b7d7a2fe97.png" alt="8e28c3c1a14fcb57dd1ee7b7d7a2fe97.png" width = "800px" height = "400px">

5. Customers Page: Showcases customers and their purchased products and purchased dates. Users can also buy products from this page.
   <img src="https://imgtr.ee/images/2023/07/31/d564a92b47ce4b88446d084042627862.png" alt="d564a92b47ce4b88446d084042627862.png" width = "800px" height = "400px">

- Add product

<img src="https://imgtr.ee/images/2023/07/31/a9c37dcc642bf946c1357a328dc486ec.png" alt="a9c37dcc642bf946c1357a328dc486ec.png" width = "800px" height = "400px">

<img src="https://imgtr.ee/images/2023/07/31/be4f9c6a7be309158e2478e3043c7e0b.png" alt="be4f9c6a7be309158e2478e3043c7e0b.png" width = "800px" height = "400px">

6. Edit Customer Page: Allows Admin users to update or delete customer data.

<img src="https://imgtr.ee/images/2023/07/31/fa8117fe5f1273936f81496679dd7658.png" alt="fa8117fe5f1273936f81496679dd7658.png" width = "800px" height = "400px">

7. Purchases Page: Allows users to search for purchases by product, customer, or date.
   <img src="https://imgtr.ee/images/2023/07/31/acc18c9f6467105ada6f262779886a3a.png" alt="acc18c9f6467105ada6f262779886a3a.png" width = "800px" height = "400px">

- No results from query found: If a user performs a search on the Purchases page and there are no results that match the search criteria, a helpful message will be displayed to inform the user that no search results were found.

<img src="https://imgtr.ee/images/2023/07/31/fb2c99a151df01de9073abc40527bfef.png" alt="fb2c99a151df01de9073abc40527bfef.png" width = "800px" height = "400px">

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
