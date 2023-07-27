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

const Purchases = () => {
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [date, setDate] = useState(null);

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

    if (data.Date) {
      const formattedDate = format(
        new Date(data.Date),
        "yyyy-MM-dd'T'HH:mm:ss"
      );

      purchasesQuery = query(
        purchasesQuery,
        where("Date", "==", formattedDate)
      );
    }

    const unsubscribe = onSnapshot(purchasesQuery, (snapshot) => {
      setPurchases(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
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
            <Select {...register("product")}>
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
            <Select {...register("customer")}>
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
            onChange={(date) => setDate(date)}
            renderInput={(props) => (
              <TextField {...props} {...register("Date")} />
            )}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Button type="submit" variant="contained">
              Search
            </Button>
          </Box>
        </form>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ border: "1px solid #000" }}>
                  Product
                </TableCell>
                <TableCell style={{ border: "1px solid #000" }}>
                  Customer
                </TableCell>
                <TableCell style={{ border: "1px solid #000" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell style={{ border: "1px solid #000" }}>
                    {productsObj[purchase.ProductID]}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #000" }}>
                    {customersObj[purchase.CustomerID]}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #000" }}>
                    {purchase.Date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default Purchases;
