import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router";
import { Box, Button, List, ListItem, TextField } from "@mui/material";
import {
  doc,
  where,
  getDocs,
  getDoc,
  updateDoc,
  collection,
  query,
  writeBatch,
} from "firebase/firestore";
import { useNavigate } from "react-router";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState({
    FirstName: "",
    LastName: "",
    City: "",
  });

  const [purchased, setPurchased] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const docRef = doc(db, "customers", customerId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCustomer(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    setIsLoading(false);
    fetchCustomer();
  }, [customerId]);

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        setIsLoading(true);

        // Query the 'purchases' collection where 'CustomerID' equals to 'customerId'
        const q = query(
          collection(db, "purchases"),
          where("CustomerID", "==", customerId)
        );

        const querySnapshot = await getDocs(q);

        // Store all product IDs in a Set to avoid duplicates
        const productIdsSet = new Set();
        querySnapshot.docs.forEach((document) => {
          const productId = document.data().ProductID;
          productIdsSet.add(productId);
        });

        // Initialize an empty array to store products
        let productsList = [];

        // For each unique product ID, fetch the product document from the 'products' collection
        for (const productId of productIdsSet) {
          const productDocRef = doc(db, "products", productId);
          const productDocSnap = await getDoc(productDocRef);

          // If the document exists, add it to the 'productsList' array
          if (productDocSnap.exists()) {
            productsList.push({ ...productDocSnap.data(), id: productId });
          } else {
            console.log("No such document!");
          }
        }

        // Set the 'purchased' state to the list of fetched products
        setPurchased(productsList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(false);
    fetchPurchasedProducts();
  }, [customerId]);

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const docRef = doc(db, "customers", customerId);
    await updateDoc(docRef, customer);
    toast.success(
      `Customer ${
        customer.FirstName + " " + customer.LastName
      } updated successfully`
    );
    navigate("/");
  };

  const deleteCustomer = async () => {
    const batch = writeBatch(db); // Create a write batch

    // Delete the customer document
    const customerDocRef = doc(db, "customers", customerId);
    batch.delete(customerDocRef);

    // Query for all purchase documents related to the customer
    const q = query(
      collection(db, "purchases"),
      where("CustomerID", "==", customerId)
    );
    const querySnapshot = await getDocs(q);

    // Add each document to the batch for deletion
    querySnapshot.docs.forEach((document) => {
      const purchaseDocRef = doc(db, "purchases", document.id);
      batch.delete(purchaseDocRef);
    });

    // Commit the batch
    await batch.commit();
    toast.success(
      `Customer ${
        customer.FirstName + " " + customer.LastName
      } and its related data from the purchases table deleted successfully`
    );

    navigate("/");
  };

  return (
    <Layout title={"Edit Customer"}>
      {isLoading ? (
        <Spinner text={"Edit Customer"} />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2>
              Edit Customer - {customer.FirstName + " " + customer.LastName}
            </h2>
            {customer && (
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <TextField
                  label="FirstName"
                  name="FirstName"
                  value={customer.FirstName}
                  onChange={handleInputChange}
                />
                <TextField
                  label="LastName"
                  name="LastName"
                  value={customer.LastName}
                  onChange={handleInputChange}
                />
                <TextField
                  label="City"
                  name="City"
                  value={customer.City}
                  onChange={handleInputChange}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Update Customer
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={deleteCustomer}
                  >
                    Delete Customer
                  </Button>
                </Box>
              </form>
            )}

            <h2>Purchased Products</h2>
            <List>
              {purchased.map((product) => (
                <ListItem key={product.id}>
                  <Link to={`/editProduct/${product.id}`}>{product.Name}</Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Layout>
  );
};

export default EditCustomer;
