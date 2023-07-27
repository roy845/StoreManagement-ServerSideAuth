import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  incrementTotalPurchases,
  selectProducts,
} from "../features/products/productsSlice";

import { Button, MenuItem, Select } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const AddProductToCustomer = ({ customer }) => {
  const products = useSelector(selectProducts);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");

  const dispatch = useDispatch();

  const handleSelectProduct = (e) => {
    setSelectedProduct(e.target.value);
    const product = products.filter(
      (product) => product.id === e.target.value
    )[0];

    setSelectedProductName(product.Name);
  };

  const handleAddProduct = async () => {
    // The path to the document in Firestore
    const customerDoc = doc(db, "customers", customer.id);
    const productDoc = doc(db, "products", selectedProduct);

    // Read the current customer document from Firestore
    const customerSnap = await getDoc(customerDoc);
    const customerData = customerSnap.data();

    // Check if product already exists in the customer's products
    const existingProduct = customerData.products.find(
      (product) => product.id === selectedProduct
    );

    let updatedProducts;
    if (existingProduct) {
      // If product exists, increment quantity
      updatedProducts = customerData.products.map((product) =>
        product.id === selectedProduct
          ? { ...product, quantity: (product.quantity || 1) + 1 }
          : product
      );
    } else {
      // If product does not exist, add it with quantity 1
      const productToAdd = {
        id: selectedProduct,
        purchaseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        quantity: 1,
      };
      updatedProducts = [...customerData.products, productToAdd];
    }

    // Update the document in Firestore
    setDoc(customerDoc, { products: updatedProducts })
      .then(() => {
        toast.success(
          `Product ${selectedProductName} added to customer ${customer.FirstName} ${customer.LastName}`
        );
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });

    // Update the product document in Firestore
    setDoc(
      productDoc,
      {
        customers: arrayUnion(customer.id),
      },
      { merge: true }
    )
      .then(() => {
        toast.success(
          `Customer ${customer.FirstName} ${customer.LastName} added to product ${selectedProductName}`
        );
      })
      .catch((error) => {
        console.error("Error adding customer to product:", error);
      });

    dispatch(incrementTotalPurchases());

    setSelectedProduct("");
    setSelectedProductName("");
  };

  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Select
        value={selectedProduct}
        onChange={handleSelectProduct}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select a product
        </MenuItem>
        {products?.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.Name}
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        size="medium"
        sx={{ backgroundColor: "green" }}
        onClick={handleAddProduct}
      >
        Save
      </Button>
    </div>
  );
};

export default AddProductToCustomer;
