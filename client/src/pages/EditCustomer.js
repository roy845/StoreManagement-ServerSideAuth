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
  documentId,
  writeBatch,
} from "firebase/firestore";
import { useNavigate } from "react-router";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

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

        const q = query(
          collection(db, "purchases"),
          where("CustomerID", "==", customerId)
        );

        const querySnapshot = await getDocs(q);

        // Use map() to extract productIds from each document
        const productIds = querySnapshot.docs.map(
          (document) => document.data().ProductID
        );

        // Create a new query for the 'products' collection that fetches all products with an ID in the 'productIds' array
        const productsQuery = query(
          collection(db, "products"),
          where(documentId(), "in", productIds)
        );

        const productsQuerySnapshot = await getDocs(productsQuery);

        const productsList = productsQuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPurchased(productsList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

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
            <h2 style={{ textAlign: "center" }}>
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
                    startIcon={<UpdateIcon />}
                  >
                    Update Customer
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "red" }}
                    onClick={deleteCustomer}
                    startIcon={<DeleteIcon />}
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
