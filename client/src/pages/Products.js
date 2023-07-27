import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "../components/Layout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProducts,
  setProducts,
} from "../features/products/productsSlice";
import TotalProductsPurchased from "../components/TotalProductsPurchased";
import { toast } from "react-hot-toast";
import ProductRegion from "../components/ProductRegion";
import { Divider } from "@mui/material";
import Spinner from "../components/Spinner";

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
        dispatch(setProducts(productsData));
      } catch (error) {
        toast.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <Layout title={"products"}>
      {isLoading ? (
        <Spinner text={"Products"} />
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <h1 style={{ textAlign: "center" }}>Products</h1>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    overflow: "scroll",
                    overflowX: "hidden",
                    maxHeight: "500px",
                    bgcolor: "background.paper",
                    m: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                    width: "50%",
                    height: "auto",
                    border: "1px solid black",
                  }}
                >
                  {products.map((product) => (
                    <div key={product.id}>
                      <ProductRegion product={product} />
                      <Divider
                        sx={{ borderColor: "black", bgcolor: "black" }}
                      />
                    </div>
                  ))}
                </Box>

                <Box
                  sx={{
                    p: 1,
                    bgcolor: "background.paper",
                    m: 1,
                    mr: 5,
                    borderRadius: 1,
                    boxShadow: 1,
                    width: "30%",
                    height: "auto",
                    border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  <TotalProductsPurchased />
                </Box>
              </Box>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>
              There are currently no products available
            </p>
          )}
        </>
      )}
    </Layout>
  );
};

export default Products;
