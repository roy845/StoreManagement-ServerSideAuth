import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Layout from "../components/Layout";
import { Box, Button, List, ListItem, TextField } from "@mui/material";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  documentId,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

const EditProduct = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    Name: "",
    Price: "",
    Quantity: 0,
  });
  const [customers, setCustomers] = useState([]);
  const db = getFirestore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProductData(docSnap.data());
        } else {
          console.log("No such document!");
        }

        const q = query(
          collection(db, "purchases"),
          where("ProductID", "==", productId)
        );
        const querySnapshot = await getDocs(q);

        // Use map() to extract customerIds from each document
        const customerIds = querySnapshot.docs.map(
          (document) => document.data().CustomerID
        );

        // Create a new query for the 'customers' collection that fetches all customers with an ID in the 'customerIds' array
        const customersQuery = query(
          collection(db, "customers"),
          where(documentId(), "in", customerIds)
        );

        const customersQuerySnapshot = await getDocs(customersQuery);

        const customersList = customersQuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setCustomers(customersList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, db]);

  const handleInputChange = (e) => {
    const value =
      e.target.name === "Quantity" || e.target.name === "Price"
        ? +e.target.value
        : e.target.value;

    // Ensure the quantity or price is non-negative
    if (
      (e.target.name === "Quantity" || e.target.name === "Price") &&
      value < 0
    ) {
      toast.error("Product Quantity or Price cannot be a negative number.");
      return; // Exit the function early without setting the state
    }

    setProductData({ ...productData, [e.target.name]: value });
  };

  const updateProduct = async () => {
    await updateDoc(doc(db, "products", productId), productData);
    toast.success(`Product ${productData.Name} updated successfully`);
    navigate("/");
  };

  const deleteProduct = async () => {
    const batch = writeBatch(db); // Create a write batch

    // Delete the product document
    const productDocRef = doc(db, "products", productId);
    batch.delete(productDocRef);

    // Query for all purchase documents related to the product
    const q = query(
      collection(db, "purchases"),
      where("ProductID", "==", productId)
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
      `Product ${productData.Name} and its purchases deleted successfully`
    );

    navigate("/");
  };

  return (
    <Layout title={"Edit Product"}>
      {isLoading ? (
        <Spinner text={"Edit Product"} />
      ) : (
        <>
          {" "}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div>
              <h2 style={{ textAlign: "center" }}>
                Edit Product - {productData.Name}
              </h2>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <TextField
                  name="Name"
                  label="Product Name"
                  value={productData.Name}
                  onChange={handleInputChange}
                />
                <TextField
                  name="Price"
                  label="Product Price"
                  type="number"
                  value={`${productData.Price}`}
                  onChange={handleInputChange}
                />
                <TextField
                  name="Quantity"
                  type="number"
                  label="Product Quantity"
                  value={productData.Quantity}
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
                    onClick={updateProduct}
                    startIcon={<UpdateIcon />}
                  >
                    Update Product
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "red" }}
                    onClick={deleteProduct}
                    startIcon={<DeleteIcon />}
                  >
                    Delete Product
                  </Button>
                </Box>
              </form>
            </div>
            <div>
              <h2>Customers</h2>
              <List>
                {customers.map((customer, index) => (
                  <ListItem
                    key={index}
                    style={{ textDecoration: "none", listStyle: "none" }}
                  >
                    <Link to={`/editCustomer/${customer?.id}`}>
                      {customer?.FirstName + " " + customer?.LastName}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </div>
          </Box>
        </>
      )}
    </Layout>
  );
};

export default EditProduct;
