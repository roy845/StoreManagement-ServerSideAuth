import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Layout from "../components/Layout";
import { Box, Button, TextField } from "@mui/material";
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
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";

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

        const customerIdsSet = new Set();
        querySnapshot.docs.forEach((document) => {
          const customerId = document.data().CustomerID;
          customerIdsSet.add(customerId);
        });

        let customersList = [];

        for (const customerId of customerIdsSet) {
          const customerDocRef = doc(db, "customers", customerId);
          const customerDocSnap = await getDoc(customerDocRef);

          if (customerDocSnap.exists()) {
            customersList.push({ ...customerDocSnap.data(), id: customerId });
          } else {
            console.log("No such document!");
          }
        }

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
    setProductData({ ...productData, [e.target.name]: e.target.value });
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
              <h2>Edit Product - {productData.Name}</h2>
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
                  value={`${productData.Price}`}
                  onChange={handleInputChange}
                />
                <TextField
                  name="Quantity"
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
                  >
                    Update Product
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={deleteProduct}
                  >
                    Delete Product
                  </Button>
                </Box>
              </form>
            </div>
            <div>
              <h2>Customers</h2>
              <ul>
                {customers.map((customer, index) => (
                  <li
                    key={index}
                    style={{ textDecoration: "none", listStyle: "none" }}
                  >
                    <Link to={`/editCustomer/${customer?.id}`}>
                      {customer?.FirstName + " " + customer?.LastName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Box>
        </>
      )}
    </Layout>
  );
};

export default EditProduct;
