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
        const customersSnapshot = await getDocs(customersCollection);
        const customersData = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          purchases: [], // Change 'products' and 'purchasedDates' to a single 'purchases' array
          ...doc.data(),
        }));

        // Fetch purchases and product details for each customer
        for (let customer of customersData) {
          const purchasesCollection = collection(db, "purchases");
          const purchasesSnapshot = await getDocs(purchasesCollection);
          for (let document of purchasesSnapshot.docs) {
            const purchase = document.data();
            if (purchase.CustomerID === customer.id) {
              const productSnapshot = await getDoc(
                doc(db, "products", purchase.ProductID)
              );
              // Push an object containing product data, product id and purchase date
              customer.purchases.push({
                productData: productSnapshot.data(),
                productId: productSnapshot.id,
                purchaseDate: purchase.Date,
              });
            }
          }
        }
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
                      }}
                    >
                      Customer Name
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid black",
                        borderRight: "1px solid black",
                      }}
                    >
                      Products
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid black" }}>
                      Purchased Dates
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
                        }}
                      >
                        {customer.FirstName} {customer.LastName}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
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
                      <TableCell sx={{ borderBottom: "1px solid black" }}>
                        {customer?.purchases?.map((purchase, index) => (
                          <div key={index}>{purchase.purchaseDate}</div>
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
