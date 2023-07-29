import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import NoPurchasesToShow from "../components/NoPurchasesToShow";

const Purchases = () => {
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [date, setDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCol = collection(db, "products");
      const productsSnapshot = await getDocs(productsCol);
      setProducts(
        productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    const fetchCustomers = async () => {
      const customersCol = collection(db, "customers");
      const customersSnapshot = await getDocs(customersCol);
      setCustomers(
        customersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchProducts();
    fetchCustomers();
  }, []);

  const onSubmit = (data) => {
    setSearched(true);
    let purchasesQuery = collection(db, "purchases");

    if (data.product !== "*") {
      purchasesQuery = query(
        purchasesQuery,
        where("ProductID", "==", data.product)
      );
    }

    if (data.customer !== "*") {
      purchasesQuery = query(
        purchasesQuery,
        where("CustomerID", "==", data.customer)
      );
    }

    if (date) {
      const startOfDay = format(
        date.setHours(0, 0, 0, 0),
        "yyyy-MM-dd'T'HH:mm:ss"
      );
      const endOfDay = format(
        date.setHours(23, 59, 59, 999),
        "yyyy-MM-dd'T'HH:mm:ss"
      );

      purchasesQuery = query(
        purchasesQuery,
        where("Date", ">=", startOfDay),
        where("Date", "<=", endOfDay)
      );
    }

    const unsubscribe = onSnapshot(purchasesQuery, (snapshot) => {
      setPurchases(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  };

  const resetForm = () => {
    reset({ product: "", customer: "", Date: null });
    setDate(null);
    setSelectedProduct("");
    setSelectedCustomer("");
    setPurchases([]);
    setSearched(false);
  };

  // Convert arrays to objects for faster lookup.
  const productsObj = products.reduce((obj, product) => {
    obj[product.id] = product.Name;
    return obj;
  }, {});

  const customersObj = customers.reduce((obj, customer) => {
    obj[customer.id] = customer.FirstName + " " + customer.LastName;
    return obj;
  }, {});

  return (
    <Layout title={"Purchases"}>
      <h1 style={{ textAlign: "center" }}>Purchases</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="product-select-label">Product</InputLabel>

            <Select
              {...register("product")}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <MenuItem value="*">All</MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="customer-select-label">Customer</InputLabel>

            <Select
              {...register("customer")}
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <MenuItem value="*">All</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.FirstName + " " + customer.LastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            value={date}
            label="Date"
            onChange={(date) => {
              setDate(date);
            }}
            renderInput={(props) => (
              <TextField {...props} {...register("Date")} />
            )}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
              marginBottom: 2,
              gap: 2, // set the gap
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={
                selectedProduct === "" || selectedCustomer === "" || !date
              }
            >
              Search
            </Button>

            <Button
              style={{
                backgroundColor:
                  !selectedProduct || !selectedCustomer || !date
                    ? "gray"
                    : "red",
                color: "white",
              }}
              variant="contained"
              onClick={resetForm}
              disabled={!selectedProduct || !selectedCustomer || !date}
            >
              Reset
            </Button>
          </Box>
        </form>
        {purchases.length > 0 && (
          <div>
            <strong>Total Purchases:</strong> {purchases.length}
          </div>
        )}
        {searched && purchases.length > 0 ? (
          <TableContainer style={{ maxWidth: "50%", margin: "0 auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ border: "1px solid #000", textAlign: "center" }}
                  >
                    <strong>Product</strong>
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #000", textAlign: "center" }}
                  >
                    <strong>Customer</strong>
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #000", textAlign: "center" }}
                  >
                    <strong>Date</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        <strong>{productsObj[purchase.ProductID]}</strong>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        <strong>{customersObj[purchase.CustomerID]}</strong>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                        }}
                      >
                        <strong>
                          {format(
                            new Date(purchase.Date),
                            "d MMMM yyyy, HH:mm:ss"
                          )}
                        </strong>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={purchases.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : searched ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NoPurchasesToShow />
          </Box>
        ) : null}
      </Box>
    </Layout>
  );
};

export default Purchases;
