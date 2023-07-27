import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { addPurchase } from "../features/purchases/purchasesSlice";
import { toast } from "react-hot-toast";
import {
  incrementTotalPurchases,
  setProducts,
  decrementQuantity,
} from "../features/products/productsSlice";

const CustomerItem = ({ customer, purchase }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  const handleAddClick = () => {
    setShowAddForm(!showAddForm);
  };

  useEffect(() => {
    // Fetch products data from Firestore
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setProducts(productsData));
      } catch (error) {
        toast.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleSaveClick = async () => {
    if (selectedProduct) {
      const newPurchase = {
        ID: Date.now().toString(), // Generate a simple unique id
        CustomerID: customer.id,
        ProductID: selectedProduct,
        // Use format to store the current date and time
        Date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      };

      const { ID, ...purchaseData } = newPurchase;

      try {
        const productRef = doc(db, "products", selectedProduct);
        const productSnapshot = await getDoc(productRef);
        const productData = productSnapshot.data();

        if (productData.Quantity <= 0)
          throw new Error(`Product ${productData.Name} Is Out of stock`);

        // Add the purchase to Firestore
        await addDoc(collection(db, "purchases"), purchaseData);
        dispatch(addPurchase(newPurchase));
        dispatch(incrementTotalPurchases());
        dispatch(decrementQuantity(selectedProduct));

        // Decrement the quantity of the selected product
        await updateDoc(productRef, {
          Quantity: productData.Quantity - 1,
        });

        toast.success(
          `Product ${productData.Name} is added to ${
            customer.FirstName + " " + customer.LastName
          }`
        );

        setShowAddForm(false);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <h4>
        <Link to={`/editCustomer/${customer.id}`}>
          {customer.FirstName} {customer.LastName}
        </Link>
      </h4>
      <p>
        Purchased Date:{" "}
        {format(new Date(purchase.Date), "yyyy-MM-dd'T'HH:mm:ss")}
      </p>
      <Button variant="contained" color="primary" onClick={handleAddClick}>
        Add
      </Button>

      {showAddForm && (
        <div>
          <FormControl
            sx={{
              minWidth: 420,
              marginRight: "10px",
            }}
          >
            <InputLabel id="product-select-label">Select Product</InputLabel>
            <Select
              value={selectedProduct}
              label="Select Product"
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem
                  key={product.id}
                  value={product.id}
                  style={{ color: product.Quantity === 0 ? "red" : "black" }}
                >
                  {product.Name}{" "}
                  {product.Quantity === 0 ? "(Out of Stock)" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerItem;
