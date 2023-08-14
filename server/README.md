# React Store Management App

This project is a store management application built using React, Redux (for state management), and Firebase and MongoDB (for database and user authentication). The application provides an interface for managing products, customers, and purchases, with initial data including two products and two customers. Users can interact with the system through several pages including "Menu - as navigation drawer", "Products", "Edit Product", "Customers", "Edit Customer", and "Purchases". Additionally, a user authentication & authorization system is implemented using MongoDB and JWT authentication & authorization service.

## Features

1. User Authentication & Authorization: User login/register features using JWT authentication and MongoDB. User roles are defined as "User" and "Admin".

- Login

<a href="https://ibb.co/D9TbNgY"><img src="https://i.ibb.co/Wkj3Qp0/login-page-screen.png" alt="login-page-screen" border="0"></a>

- Register

<a href="https://ibb.co/H4F9L1t"><img src="https://i.ibb.co/7CY0x8n/signup-page-screen.png" alt="signup-page-screen" border="0"></a>

2. Menu Navigation: Provides navigation to "Products", "Customers", and "Purchases" pages and also for logging out the current connected user.

<a href="https://ibb.co/cFz44T4"><img src="https://i.ibb.co/KqCTTyT/Navigation-component.png" alt="Navigation-component" border="0"></a>

3. Products Page: Displays total amount of purchased products and detailed product data. Users can add new products to customers from this page.

<a href="https://ibb.co/L1L8k6F"><img src="https://i.ibb.co/SBhPs0j/products-page-screen.png" alt="products-page-screen" border="0"></a>

- Add product

<a href="https://ibb.co/spfFfT7"><img src="https://i.ibb.co/fVgCg3J/Add-product-from-products-page-screen.png" alt="Add-product-from-products-page-screen" border="0"></a>

4. Edit Product Page: Allows Admin users to update or delete product data.

<a href="https://ibb.co/RpgR9jB"><img src="https://i.ibb.co/vxc0HXQ/edit-product-page-screen.png" alt="edit-product-page-screen" border="0"></a>

5. Customers Page: Showcases customers and their purchased products and purchased dates. Users can also buy products from this page.
   <a href="https://ibb.co/jh6zK7n"><img src="https://i.ibb.co/PxmMpBq/customers-page-screen.png" alt="customers-page-screen" border="0"></a>

- Add product

<a href="https://ibb.co/0K4fCnX"><img src="https://i.ibb.co/T1jH4wT/Add-product-from-customers-page-screen.png" alt="Add-product-from-customers-page-screen" border="0"></a>

<a href="https://ibb.co/6WJr2d7"><img src="https://i.ibb.co/KrzbY1p/Add-product-from-customers-page-screen2.png" alt="Add-product-from-customers-page-screen2" border="0"></a>

6. Edit Customer Page: Allows Admin users to update or delete customer data.

<a href="https://ibb.co/pnw3LLX"><img src="https://i.ibb.co/7bCG11y/edit-customer-page-screen.png" alt="edit-customer-page-screen" border="0"></a>

7. Purchases Page: Allows users to search for purchases by product, customer, or date.
   <a href="https://ibb.co/YWgCKLB"><img src="https://i.ibb.co/ZJ9jwMz/purchases-page-screen-with-header.png" alt="purchases-page-screen-with-header" border="0"></a>

- No results from query found: If a user performs a search on the Purchases page and there are no results that match the search criteria, a helpful message will be displayed to inform the user that no search results were found.

<a href="https://ibb.co/z8zhJh1"><img src="https://i.ibb.co/SQzXrX2/No-search-results-with-header.png" alt="No-search-results-with-header" border="0"></a>

8. Not Found Page: This page is used when a user tries to navigate to a non-existing page or route in your application.

<a href="https://ibb.co/d7DzyFd"><img src="https://i.ibb.co/pnd9pct/Page-Not-Found-screen.png" alt="Page-Not-Found-screen" border="0"></a>

9. Unauthorized Page: This page is used when a user tries to access a resource for which they do not have permission.

<a href="https://ibb.co/8McxM8W"><img src="https://i.ibb.co/rkspkyC/Unauthorized-page-screen.png" alt="Unauthorized-page-screen" border="0"></a>

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

- **Material UI**
  <a href="https://ibb.co/VtWN1my"><img src="https://i.ibb.co/wRNLksH/mui-logo.png" alt="mui-logo" width = "60px" height = "60px" border="0"></a>

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
