import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCustomers,
  setCustomers,
} from "../features/customers/customersSlice";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  selectProducts,
  setProducts,
} from "../features/products/productsSlice";
import { format } from "date-fns";
import Spinner from "../components/Spinner";

const Customers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customers = useSelector(selectCustomers);
  const products = useSelector(selectProducts);
  const [showBuyProductForm, setShowBuyProductForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleBuyProductClick = () => {
    setShowBuyProductForm(!showBuyProductForm);
  };

  const handleCustomerSelect = (e) => {
    setSelectedCustomerId(e.target.value);
  };

  const handleProductSelect = (e) => {
    setSelectedProductId(e.target.value);
  };

  // To handle form submission, you want to add the purchased product to the Firestore
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const productRef = doc(db, "products", selectedProductId);
      const productSnapshot = await getDoc(productRef);
      const productData = productSnapshot.data();

      if (productData.Quantity <= 0)
        throw new Error(`Product ${productData.Name} Is Out of stock`);

      // Add the selected product to the "purchases" Collection with the current date
      await addDoc(collection(db, "purchases"), {
        CustomerID: selectedCustomerId,
        ProductID: selectedProductId,
        Date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      });

      // Decrement the quantity of the selected product
      await updateDoc(productRef, {
        Quantity: productData.Quantity - 1,
      });

      toast.success("Product purchased successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
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

  // Modify this useEffect to get purchases for each customer
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersCollection = collection(db, "customers");
        const purchasesCollection = collection(db, "purchases");
        const productsCollection = collection(db, "products");

        // Fetch all collections at once
        const [customersSnapshot, purchasesSnapshot, productsSnapshot] =
          await Promise.all([
            getDocs(customersCollection),
            getDocs(purchasesCollection),
            getDocs(productsCollection),
          ]);

        // Convert to data arrays
        const customersData = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          purchases: [],
          ...doc.data(),
        }));
        const purchasesData = purchasesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Link data together
        customersData.forEach((customer) => {
          const customerPurchases = purchasesData.filter(
            (purchase) => purchase.CustomerID === customer.id
          );
          customerPurchases.forEach((purchase) => {
            const product = productsData.find(
              (product) => product.id === purchase.ProductID
            );
            if (product) {
              customer.purchases.push({
                productData: product,
                productId: product.id,
                purchaseDate: purchase.Date,
              });
            }
          });
        });

        setIsLoading(false);
        dispatch(setCustomers(customersData));
      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [dispatch]);

  return (
    <Layout title={"customers"}>
      {isLoading ? (
        <Spinner text={"Customers"} />
      ) : (
        <>
          <h1 style={{ textAlign: "center" }}>Customers</h1>
          <Box>
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "800px",
                margin: "0 auto",
                border: "1px solid black",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid black",
                        borderRight: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <strong>Customer Name</strong>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid black",
                        borderRight: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <strong>Products</strong>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <strong>Purchased Dates</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers?.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <strong>
                          {customer.FirstName} {customer.LastName}
                        </strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        {customer?.purchases?.map((purchase, index) => (
                          <div key={index}>
                            <Link to={`/editProduct/${purchase.productId}`}>
                              {purchase.productData.Name}
                            </Link>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        {customer?.purchases?.map((purchase, index) => (
                          <div key={index}>
                            <strong>
                              {format(
                                new Date(purchase.purchaseDate),
                                "d MMMM yyyy, HH:mm:ss"
                              )}
                            </strong>
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBuyProductClick}
              >
                Buy Product
              </Button>
            </div>

            {showBuyProductForm && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 420,
                  }}
                >
                  <form>
                    <FormControl
                      sx={{
                        minWidth: 420,
                        marginRight: "10px",
                      }}
                    >
                      <InputLabel id="product-select-label">
                        Select Product
                      </InputLabel>
                      <Select
                        labelId="product-select-label"
                        id="product-select"
                        value={selectedProductId}
                        onChange={handleProductSelect}
                      >
                        {products.map((product) => (
                          <MenuItem
                            key={product.id}
                            value={product.id}
                            style={{
                              color: product.Quantity === 0 ? "red" : "black",
                            }}
                          >
                            {product.Name}{" "}
                            {product.Quantity === 0
                              ? "(Out of Stock)"
                              : " - " + product.Quantity + " Items left"}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      sx={{
                        minWidth: 420,
                        marginRight: "10px",
                      }}
                    >
                      <InputLabel id="customer-select-label">
                        Select Customer
                      </InputLabel>
                      <Select
                        labelId="customer-select-label"
                        id="customer-select"
                        value={selectedCustomerId}
                        onChange={handleCustomerSelect}
                      >
                        {customers.map((customer) => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.FirstName} {customer.LastName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </form>
                  <Button
                    disabled={!selectedProductId || !selectedCustomerId}
                    onClick={handleFormSubmit}
                    variant="contained"
                    color="primary"
                  >
                    Buy
                  </Button>
                </Box>
              </div>
            )}
          </Box>
        </>
      )}
    </Layout>
  );
};

export default Customers;
